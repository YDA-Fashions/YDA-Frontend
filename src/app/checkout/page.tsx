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
  const [currentStep, setCurrentStep] = useState(1);

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
        discount: discountAmount * 100,
        shipping: shippingFee * 100,
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
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-background flex flex-col items-center justify-center p-6 text-center">
        <Header />
        <div className="w-12 h-12 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white">Securing Connection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-background transition-colors duration-500">
      <Header />
      
      <main className="pt-24 pb-24 md:pt-36 overflow-x-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-20 items-start">
            
            {/* LEFT: MULTI-STEP FLOW */}
            <div className="lg:col-span-7 xl:col-span-8 overflow-hidden">
              
              {/* Progress Steps */}
              <div className="flex items-center gap-3 md:gap-6 mb-16 overflow-x-auto no-scrollbar py-2">
                {[
                  { step: 1, label: "Identity" },
                  { step: 2, label: "Shipping" },
                  { step: 3, label: "Payment" }
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2 md:gap-4 shrink-0">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-black transition-all duration-700 ${
                      currentStep === s.step ? "bg-black text-white dark:bg-white dark:text-black scale-105 shadow-xl" : currentStep > s.step ? "bg-emerald-500 text-white" : "bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20"
                    }`}>
                      {currentStep > s.step ? <CheckCircle2 size={14} /> : s.step}
                    </div>
                    <span className={`text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black ${currentStep >= s.step ? "opacity-100 dark:text-white" : "opacity-20 dark:text-white/20"}`}>
                      {s.label}
                    </span>
                    {s.step < 3 && <div className="w-6 md:w-12 h-[1px] bg-black/5 dark:bg-white/5 mx-1" />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                >
                  <div className="mb-10">
                    <h1 className="text-3xl md:text-6xl font-serif tracking-tighter mb-4 italic leading-[1.1] dark:text-white">
                      {currentStep === 1 ? "Start Your Narrative." : currentStep === 2 ? "The Final Destination." : "Secure Fulfillment."}
                    </h1>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-black text-black/30 dark:text-white/30">Phase {currentStep} / 3</p>
                  </div>

                  <div className="space-y-8">
                    {currentStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/50 dark:text-white/40 ml-1">Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/20 dark:border-white/10 p-5 text-sm outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm dark:text-white"
                            placeholder="Aaryan Malhotra"
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/50 dark:text-white/40 ml-1">Contact Channel</label>
                          <input 
                            type="tel" 
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                            className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/20 dark:border-white/10 p-5 text-sm outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm dark:text-white"
                            placeholder="10-digit Mobile No"
                          />
                        </div>
                        <div className="md:col-span-2 pt-4">
                           <button onClick={nextStep} className="group flex items-center gap-4 bg-black text-white dark:bg-white dark:text-black px-10 py-4 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-accent-dark transition-all shadow-xl">
                             Next Step
                             <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/50 dark:text-white/40 ml-1">
                            Postal Pin {pincodeLoading && <span className="text-emerald-500 animate-pulse">— Verifying</span>}
                          </label>
                          <input 
                            type="tel" 
                            maxLength={6}
                            value={formData.pincode}
                            onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                            className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/20 dark:border-white/10 p-5 text-sm outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm dark:text-white"
                            placeholder="6-digit PIN"
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/50 dark:text-white/40 ml-1">House / Suite</label>
                          <input 
                            type="text" 
                            value={formData.house}
                            onChange={(e) => setFormData({...formData, house: e.target.value})}
                            className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/20 dark:border-white/10 p-5 text-sm outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm dark:text-white"
                            placeholder="Flat 102, Blue Heights"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2.5">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/50 dark:text-white/40 ml-1">Street / Landmark</label>
                          <input 
                            type="text" 
                            value={formData.area}
                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                            className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/20 dark:border-white/10 p-5 text-sm outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm dark:text-white"
                            placeholder="Near Central Park, Civil Lines"
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/50 dark:text-white/40 ml-1">City</label>
                          <input 
                            type="text" 
                            readOnly={!manualMode}
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className={`w-full border border-black/20 dark:border-white/10 p-5 text-sm outline-none shadow-sm dark:text-white ${manualMode ? 'bg-[#F9F9F7] dark:bg-white/5 focus:border-black dark:focus:border-white' : 'bg-black/[0.03] dark:bg-white/5 text-black/40 dark:text-white/40'}`}
                          />
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[9px] uppercase tracking-widest font-black text-black/50 dark:text-white/40 ml-1">State</label>
                          <input 
                            type="text" 
                            readOnly={!manualMode}
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            className={`w-full border border-black/20 dark:border-white/10 p-5 text-sm outline-none shadow-sm dark:text-white ${manualMode ? 'bg-[#F9F9F7] dark:bg-white/5 focus:border-black dark:focus:border-white' : 'bg-black/[0.03] dark:bg-white/5 text-black/40 dark:text-white/40'}`}
                          />
                        </div>
                        <div className="md:col-span-2 pt-4 flex flex-col md:flex-row gap-4">
                           <button onClick={prevStep} className="px-8 py-4 border border-black/10 dark:border-white/10 text-[9px] uppercase tracking-[0.4em] font-black hover:bg-black/5 dark:hover:bg-white/5 transition-all dark:text-white">
                             Back
                           </button>
                           <button onClick={nextStep} className="flex-grow bg-black text-white dark:bg-white dark:text-black px-10 py-4 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-accent-dark transition-all shadow-xl">
                             Proceed to Payment
                           </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => setPaymentMethod("COD")}
                            className={`p-6 md:p-8 border flex flex-col gap-4 transition-all text-left group relative overflow-hidden ${
                              paymentMethod === "COD" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xl" : "border-black/20 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black/40 dark:hover:border-white/20"
                            }`}
                          >
                            <Banknote size={24} className={paymentMethod === "COD" ? "text-white dark:text-black" : "text-black/30 dark:text-white/30"} />
                            <div>
                              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] dark:text-inherit">Cash on Delivery</p>
                              <p className={`text-[8px] md:text-[9px] uppercase tracking-wider mt-1 ${paymentMethod === "COD" ? "text-white/60 dark:text-black/60" : "text-black/30 dark:text-white/30"}`}>Pay upon receipt</p>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => setPaymentMethod("ONLINE")}
                            className={`p-6 md:p-8 border flex flex-col gap-4 transition-all text-left group relative overflow-hidden ${
                              paymentMethod === "ONLINE" ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xl" : "border-black/20 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black/40 dark:hover:border-white/20"
                            }`}
                          >
                            <CreditCard size={24} className={paymentMethod === "ONLINE" ? "text-white dark:text-black" : "text-black/30 dark:text-white/30"} />
                            <div>
                              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] dark:text-inherit">Online Transfer</p>
                              <p className={`text-[8px] md:text-[9px] uppercase tracking-wider mt-1 ${paymentMethod === "ONLINE" ? "text-white/60 dark:text-black/60" : "text-black/30 dark:text-white/30"}`}>UPI, Cards, Banking</p>
                            </div>
                          </button>
                        </div>

                        <div className="pt-6 flex flex-col md:flex-row gap-4">
                           <button onClick={prevStep} className="px-8 py-4 border border-black/10 dark:border-white/10 text-[9px] uppercase tracking-[0.4em] font-black hover:bg-black/5 dark:hover:bg-white/5 transition-all dark:text-white">
                             Review Address
                           </button>
                           <button 
                             onClick={handleCheckout}
                             disabled={isProcessing}
                             className="flex-grow bg-black text-white dark:bg-white dark:text-black px-10 py-4 text-[10px] uppercase tracking-[0.4em] font-black hover:bg-accent-dark transition-all shadow-xl disabled:opacity-50"
                           >
                             {isProcessing ? "Authenticating..." : `Fulfill Order - ₹${finalTotal.toLocaleString()}`}
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
              <div className="sticky top-40 space-y-6 md:space-y-10">
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.04)] backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-black/5 dark:bg-white/5" />
                  <h3 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-black mb-8 text-black/40 dark:text-white/30 border-b border-black/5 dark:border-white/10 pb-6">Selection Recap</h3>
                  
                  <div className="space-y-6 md:space-y-8 mb-10 max-h-[300px] md:max-h-[350px] overflow-y-auto no-scrollbar">
                    {activeItems.map((item) => (
                      <div key={item.id} className="flex gap-4 md:gap-6 group items-center">
                        <div className="w-16 h-20 md:w-20 md:h-24 bg-[#F9F9F7] dark:bg-white/5 flex-shrink-0 relative overflow-hidden">
                          <img src={item.colors?.[0]?.images?.[0]} alt={item.name} className="w-full h-full object-cover p-2 md:p-3 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-xs md:text-sm font-serif italic text-foreground dark:text-white mb-1">{item.name}</p>
                          <p className="text-[8px] md:text-[9px] font-black tracking-widest text-black/30 dark:text-white/20 uppercase">
                            Qty: {item.quantity} × ₹{item.selling_price.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs md:text-sm font-black text-right dark:text-white">₹{(item.selling_price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-8 border-t border-black/5 dark:border-white/10">
                    <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest font-black text-black/30 dark:text-white/30">
                      <span>Curation Total</span>
                      <span className="text-black dark:text-white">₹{activeTotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest font-black text-emerald-600">
                        <span>Artflow Discount</span>
                        <span>- ₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest font-black text-black/30 dark:text-white/30">
                      <span>Heritage Fulfillment</span>
                      <span className="text-black dark:text-white">{shippingFee === 0 ? "Complimentary" : `₹${shippingFee}`}</span>
                    </div>

                    <div className="pt-8 mt-8 border-t border-black/10 dark:border-white/10">
                      <div className="flex justify-between items-end">
                        <div className="space-y-2">
                          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-black text-black/20 dark:text-white/20">Total Investment</p>
                          <p className="text-3xl md:text-5xl font-black tracking-tighter leading-none dark:text-white">₹{finalTotal.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Architecture */}
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-sm">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-widest font-black mb-4 text-black/40 dark:text-white/40">Apply Artflow Code</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="CODE" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-grow bg-[#F9F9F7] dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 text-[9px] md:text-[10px] tracking-widest font-black outline-none focus:ring-1 ring-black/5 dark:ring-white/10 uppercase dark:text-white"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode}
                      className="bg-black text-white dark:bg-white dark:text-black px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black/90 dark:hover:bg-white/80 disabled:opacity-50 transition-all"
                    >
                      {isValidatingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                      <span className="text-[8px] md:text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">Active: {appliedCoupon.code}</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-[8px] font-black uppercase text-emerald-700 dark:text-emerald-400 underline">Remove</button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 md:gap-6 opacity-20 hover:opacity-40 transition-opacity duration-700 px-4 dark:text-white/50">
                  <div className="flex items-center gap-4">
                    <Truck size={18} strokeWidth={1.5} />
                    <span className="text-[8px] uppercase tracking-[0.3em] font-black italic">Expedited Heritage Logistics Across India</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <ShieldCheck size={18} strokeWidth={1.5} />
                    <span className="text-[8px] uppercase tracking-[0.3em] font-black italic">Secured Razorpay Transaction Node</span>
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
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full" />
          <div className="h-4 w-64 bg-black/5 dark:bg-white/5 rounded" />
        </div>
      </div>
    }>
      <CheckoutPage />
    </Suspense>
  );
}
