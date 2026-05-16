"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Banknote, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useProductStore } from "@/store/useProductStore";
import { addressService } from "@/services/addressService";
import { orderService } from "@/services/orderService";
import { couponService } from "@/services/couponService";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowId = searchParams?.get("buyNow");
  const buyNowQty = parseInt(searchParams?.get("qty") || "1");

  const { items: cartItems, getTotalPrice, clearCart } = useCartStore();
  const { products } = useProductStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { setOrderModalOpen, setErrorModalOpen } = useUIStore();
  
  const buyNowProduct = buyNowId ? products.find(p => p.id === buyNowId || p.product_code === buyNowId) : null;
  const activeItems = buyNowProduct ? [{ ...buyNowProduct, quantity: buyNowQty }] : cartItems;
  const activeTotal = buyNowProduct ? buyNowProduct.selling_price * buyNowQty : getTotalPrice();
  const shippingFee = activeTotal >= 1000 ? 0 : 100;
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment

  const discountAmount = appliedCoupon ? Math.floor((activeTotal * appliedCoupon.percent) / 100) : 0;
  const finalTotal = activeTotal + shippingFee - discountAmount;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    house: "",
    area: "",
    landmark: "",
    city: "",
    state: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");

  useEffect(() => {
    const fetchPincodeData = async () => {
      if (formData.pincode.length === 6) {
        setPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await res.json();
          if (data[0].Status === "Success" && data[0].PostOffice) {
            const post = data[0].PostOffice[0];
            setFormData(prev => ({ ...prev, city: post.District, state: post.State }));
            setManualMode(false);
          } else {
            setManualMode(true);
          }
        } catch (err) {
          setManualMode(true);
        } finally {
          setPincodeLoading(false);
        }
      }
    };
    fetchPincodeData();
  }, [formData.pincode]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const { isLoading, user } = useAuthStore.getState();
    if (isLoading) return; 
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (activeItems.length === 0 && !isAuthLoading) {
      router.push("/cart");
    }
  }, [activeItems.length, router, isAuthLoading]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const coupon = await couponService.validateCoupon(couponCode);
      setAppliedCoupon({ code: coupon.code, percent: coupon.discount_percent });
      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.phone.trim()) return false;
      if (!/^[6-9]\d{9}$/.test(formData.phone)) return false;
    }
    if (step === 2) {
      if (!formData.pincode.trim() || !formData.house.trim() || !formData.area.trim() || !formData.city.trim()) return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
    else alert("Please complete the required fields.");
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleCheckout = async () => {
    if (!validateStep(1) || !validateStep(2)) return;
    setIsProcessing(true);
    try {
      if (paymentMethod === "ONLINE") {
        const res = await loadRazorpay();
        if (!res) {
          alert("Payment gateway failed to load.");
          setIsProcessing(false);
          return;
        }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: finalTotal * 100,
          currency: "INR",
          name: "YDA Fashions",
          description: "Artisan Garment Purchase",
          image: "/images/logo.png",
          handler: async function (response: any) {
            await finalizeOrder(response.razorpay_payment_id);
          },
          prefill: { name: formData.name, email: user?.email, contact: formData.phone },
          theme: { color: "#1A1A1A" },
          modal: { ondismiss: () => setIsProcessing(false) }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await finalizeOrder("COD");
      }
    } catch (err) {
      setIsProcessing(false);
    }
  };

  const finalizeOrder = async (paymentId: string) => {
    try {
      const fullAddress = `${formData.house.trim()}, ${formData.area.trim()}, ${formData.landmark ? formData.landmark.trim() + ', ' : ''}${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`;
      const orderData = {
        user_id: user?.id,
        items: activeItems,
        amount: finalTotal * 100, 
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: fullAddress,
        payment_method: paymentMethod === "ONLINE" ? "Razorpay" : "COD",
        payment_status: paymentId === "COD" ? "pending" : "paid",
      };
      await orderService.createOrder(orderData);
      if (!buyNowId) clearCart();
      setOrderModalOpen(true, {
        productName: activeItems.length === 1 ? activeItems[0].name : `${activeItems.length} Pieces`,
        amount: finalTotal
      });
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFB] flex flex-col items-center justify-center p-6 text-center">
        <Header />
        <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Securing Connection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFB]">
      <Header />
      
      <main className="pt-24 pb-24 md:pt-36">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
            
            {/* LEFT: MULTI-STEP FLOW */}
            <div className="lg:col-span-7 xl:col-span-8">
              
              {/* Progress Steps */}
              <div className="flex items-center gap-6 mb-20 overflow-x-auto no-scrollbar py-2">
                {[
                  { step: 1, label: "Identity" },
                  { step: 2, label: "Shipping" },
                  { step: 3, label: "Payment" }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-4 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-700 ${
                      currentStep === s.step ? "bg-black text-white scale-110 shadow-xl" : currentStep > s.step ? "bg-emerald-500 text-white" : "bg-black/5 text-black/20"
                    }`}>
                      {currentStep > s.step ? <CheckCircle2 size={16} /> : s.step}
                    </div>
                    <span className={`text-[10px] uppercase tracking-[0.3em] font-black ${currentStep >= s.step ? "opacity-100" : "opacity-20"}`}>
                      {s.label}
                    </span>
                    {s.step < 3 && <div className="w-12 h-[1px] bg-black/5 mx-2" />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                >
                  <div className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tighter mb-4 italic leading-[1.1]">
                      {currentStep === 1 ? "Start Your Narrative." : currentStep === 2 ? "The Final Destination." : "Secure Fulfillment."}
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black text-black/20">Artisan Curation Phase {currentStep}/3</p>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="space-y-10">
                    {currentStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/40 ml-1">Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white border border-black/10 p-6 text-sm outline-none focus:border-black focus:shadow-2xl transition-all"
                            placeholder="Aaryan Malhotra"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/40 ml-1">Contact Channel</label>
                          <input 
                            type="tel" 
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                            className="w-full bg-white border border-black/10 p-6 text-sm outline-none focus:border-black focus:shadow-2xl transition-all"
                            placeholder="10-digit Mobile No"
                          />
                        </div>
                        <div className="md:col-span-2 pt-6">
                           <button onClick={nextStep} className="group flex items-center gap-6 bg-black text-white px-12 py-6 text-[11px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all shadow-2xl">
                             Next: Shipping Architecture
                             <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                           </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/40 ml-1">
                            Postal Pin {pincodeLoading && <span className="text-emerald-500 animate-pulse">— Verifying...</span>}
                          </label>
                          <input 
                            type="tel" 
                            maxLength={6}
                            value={formData.pincode}
                            onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                            className="w-full bg-white border border-black/10 p-6 text-sm outline-none focus:border-black focus:shadow-2xl transition-all"
                            placeholder="6-digit PIN"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/40 ml-1">House / Floor / Suite</label>
                          <input 
                            type="text" 
                            value={formData.house}
                            onChange={(e) => setFormData({...formData, house: e.target.value})}
                            className="w-full bg-white border border-black/10 p-6 text-sm outline-none focus:border-black focus:shadow-2xl transition-all"
                            placeholder="Flat 102, Blue Heights"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/40 ml-1">Street / Colony / Landmark</label>
                          <input 
                            type="text" 
                            value={formData.area}
                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                            className="w-full bg-white border border-black/10 p-6 text-sm outline-none focus:border-black focus:shadow-2xl transition-all"
                            placeholder="Near Central Park, Civil Lines"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/40 ml-1">City</label>
                          <input 
                            type="text" 
                            readOnly={!manualMode}
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className={`w-full border border-black/10 p-6 text-sm outline-none ${manualMode ? 'bg-white focus:border-black shadow-xl' : 'bg-black/[0.03] text-black/40'}`}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/40 ml-1">State</label>
                          <input 
                            type="text" 
                            readOnly={!manualMode}
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            className={`w-full border border-black/10 p-6 text-sm outline-none ${manualMode ? 'bg-white focus:border-black shadow-xl' : 'bg-black/[0.03] text-black/40'}`}
                          />
                        </div>
                        <div className="md:col-span-2 pt-6 flex gap-4">
                           <button onClick={prevStep} className="px-10 py-6 border border-black/10 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-black/5 transition-all">
                             Back
                           </button>
                           <button onClick={nextStep} className="flex-grow bg-black text-white px-12 py-6 text-[11px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all shadow-2xl">
                             Next: Payment Method
                           </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <button
                            onClick={() => setPaymentMethod("COD")}
                            className={`p-8 border flex flex-col gap-6 transition-all text-left group relative overflow-hidden ${
                              paymentMethod === "COD" ? "border-black bg-black text-white shadow-2xl" : "border-black/10 bg-white hover:border-black/30"
                            }`}
                          >
                            <Banknote size={28} className={paymentMethod === "COD" ? "text-white" : "text-black/30"} />
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-[0.3em]">Cash on Delivery</p>
                              <p className={`text-[9px] uppercase tracking-wider mt-2 ${paymentMethod === "COD" ? "text-white/60" : "text-black/20"}`}>Fulfill upon receipt</p>
                            </div>
                            {paymentMethod === "COD" && <motion.div layoutId="activePay" className="absolute top-4 right-4 text-emerald-400"><CheckCircle2 size={16} /></motion.div>}
                          </button>
                          
                          <button
                            onClick={() => setPaymentMethod("ONLINE")}
                            className={`p-8 border flex flex-col gap-6 transition-all text-left group relative overflow-hidden ${
                              paymentMethod === "ONLINE" ? "border-black bg-black text-white shadow-2xl" : "border-black/10 bg-white hover:border-black/30"
                            }`}
                          >
                            <CreditCard size={28} className={paymentMethod === "ONLINE" ? "text-white" : "text-black/30"} />
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-[0.3em]">Online Transfer</p>
                              <p className={`text-[9px] uppercase tracking-wider mt-2 ${paymentMethod === "ONLINE" ? "text-white/60" : "text-black/20"}`}>Secure via Razorpay</p>
                            </div>
                            {paymentMethod === "ONLINE" && <motion.div layoutId="activePay" className="absolute top-4 right-4 text-emerald-400"><CheckCircle2 size={16} /></motion.div>}
                          </button>
                        </div>

                        <div className="bg-emerald-50/50 p-6 border border-emerald-100 flex items-center gap-4">
                          <ShieldCheck size={20} className="text-emerald-700" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900">Artisan Authentication & Secure Encryption Enabled</p>
                        </div>

                        <div className="pt-6 flex gap-4">
                           <button onClick={prevStep} className="px-10 py-6 border border-black/10 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-black/5 transition-all">
                             Review Address
                           </button>
                           <button 
                             onClick={handleCheckout}
                             disabled={isProcessing}
                             className="flex-grow bg-black text-white px-12 py-6 text-[12px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all shadow-2xl disabled:opacity-50"
                           >
                             {isProcessing ? "Authenticating..." : `Complete Order - ₹${finalTotal.toLocaleString()}`}
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT: PREMIUM SUMMARY RECAP */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-40 space-y-10">
                <div className="bg-white border border-black/5 p-10 shadow-[0_30px_70px_rgba(0,0,0,0.04)] backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-black/5" />
                  <h3 className="text-[11px] uppercase tracking-[0.5em] font-black mb-10 text-black/40 border-b border-black/5 pb-6">Final Selection Recap</h3>
                  
                  <div className="space-y-8 mb-12 max-h-[350px] overflow-y-auto no-scrollbar">
                    {activeItems.map((item) => (
                      <div key={item.id} className="flex gap-6 group items-center">
                        <div className="w-20 h-24 bg-[#F9F9F7] flex-shrink-0 relative overflow-hidden">
                          <img src={item.colors?.[0]?.images?.[0]} alt={item.name} className="w-full h-full object-cover p-3 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-serif italic text-foreground mb-1">{item.name}</p>
                          <p className="text-[9px] font-black tracking-widest text-black/30 uppercase">
                            Qty: {item.quantity} × ₹{item.selling_price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-black text-right">₹{(item.selling_price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-5 pt-10 border-t border-black/5">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-black/30">
                      <span>Curation Total</span>
                      <span className="text-black">₹{activeTotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-emerald-600">
                        <span>Artflow Discount</span>
                        <span>- ₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-black/30">
                      <span>Heritage Fulfillment</span>
                      <span className="text-black">{shippingFee === 0 ? "Complimentary" : `₹${shippingFee}`}</span>
                    </div>

                    <div className="pt-10 mt-10 border-t border-black/10">
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-black/20">Total Investment</p>
                          <p className="text-5xl font-black tracking-tighter leading-none">₹{finalTotal.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Architecture */}
                <div className="bg-white border border-black/5 p-8 shadow-sm">
                  <p className="text-[9px] uppercase tracking-widest font-black mb-5 text-black/40">Apply Artflow Code</p>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="ENTER CODE" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-grow bg-[#F9F9F7] border-none p-5 text-[10px] tracking-widest font-black outline-none focus:ring-1 ring-black/5 uppercase"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode}
                      className="bg-black text-white px-8 text-[10px] font-black uppercase tracking-widest hover:bg-black/90 disabled:opacity-50 transition-all"
                    >
                      {isValidatingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                      <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">Active: {appliedCoupon.code}</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-[9px] font-black uppercase text-emerald-700 underline">Remove</button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-6 opacity-20 hover:opacity-40 transition-opacity duration-700 px-4">
                  <div className="flex items-center gap-5">
                    <Truck size={20} strokeWidth={1.5} />
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black italic">Expedited Heritage Logistics Across India</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black italic">Secured Razorpay Transaction Node</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

import { Suspense } from "react";

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFDFB] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-black/5 rounded-full" />
          <div className="h-4 w-64 bg-black/5 rounded" />
        </div>
      </div>
    }>
      <CheckoutPage />
    </Suspense>
  );
}
