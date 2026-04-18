"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useProductStore } from "@/store/useProductStore";
import { orderService } from "@/services/orderService";

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
  
  // 1. Determine Checkout Context (Buy Now vs Cart)
  const buyNowProduct = buyNowId ? products.find(p => p.id === buyNowId || p.product_code === buyNowId) : null;
  
  const activeItems = buyNowProduct 
    ? [{ ...buyNowProduct, quantity: buyNowQty }] 
    : cartItems;

  const activeTotal = buyNowProduct
    ? buyNowProduct.selling_price * buyNowQty
    : getTotalPrice();

  // 2. Structured Form State
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

  // 3. Pincode API Integration
  useEffect(() => {
    const fetchPincodeData = async () => {
      if (formData.pincode.length === 6) {
        setPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = await res.json();

          if (data[0].Status === "Success" && data[0].PostOffice) {
            const post = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: post.District,
              state: post.State
            }));
            setManualMode(false);
          } else {
            console.warn("Invalid Pincode");
            setManualMode(true);
          }
        } catch (err) {
          console.error("Pincode API Error:", err);
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
    // Session Guard
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // A. Validation Logic
    const { name, phone, pincode, house, area, city, state } = formData;

    // 1. Required Fields
    if (!name.trim() || !phone.trim() || !pincode.trim() || !house.trim() || !area.trim() || !city.trim()) {
      setErrorModalOpen(true, {
        title: "Missing Information",
        subtitle: "Please fill all required fields to proceed with your curation.",
        buttonText: "Revise Details"
      });
      return;
    }

    // 2. Phone Validation (Strict Indian Format)
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorModalOpen(true, {
        title: "Invalid Phone",
        subtitle: "Please provide a valid 10-digit Indian phone number starting with 6-9.",
        buttonText: "Fix Number"
      });
      return;
    }

    // 3. Pincode Validation
    if (!/^\d{6}$/.test(pincode)) {
      setErrorModalOpen(true, {
        title: "Invalid Pincode",
        subtitle: "Please provide a valid 6-digit PIN code.",
        buttonText: "Fix Pincode"
      });
      return;
    }

    if (!activeTotal || activeTotal <= 0) {
      setErrorModalOpen(true, {
        title: "Selection Error",
        subtitle: "Invalid order total. Please return to selection.",
        buttonText: "Back to Shop"
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "ONLINE") {
        const res = await loadRazorpay();
        if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          setIsProcessing(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
          amount: activeTotal * 100,
          currency: "INR",
          name: "YDA Fashions",
          description: "Artisan Garment Purchase",
          image: "/images/logo.png",
          handler: async function (response: any) {
            await finalizeOrder(response.razorpay_payment_id);
          },
          prefill: {
            name: formData.name,
            email: user?.email,
            contact: formData.phone,
          },
          theme: { color: "#1A1A1A" },
          modal: { ondismiss: () => setIsProcessing(false) }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await finalizeOrder("COD");
      }
    } catch (err: any) {
      console.error("❌ Transaction Logic Error:", err);
      setErrorModalOpen(true, {
        title: "Transaction Failed",
        subtitle: err.message || "Payment processing error.",
        buttonText: "Retry"
      });
      setIsProcessing(false);
    }
  };

  const finalizeOrder = async (paymentId: string) => {
    try {
      // Format Address components
      const fullAddress = `
        ${formData.house.trim()}, 
        ${formData.area.trim()}, 
        ${formData.landmark ? formData.landmark.trim() + ', ' : ''}
        ${formData.city.trim()}, 
        ${formData.state.trim()} - ${formData.pincode.trim()}
      `.replace(/\s+/g, ' ').trim();

      const orderData = {
        user_id: user?.id,
        items: activeItems,
        amount: activeTotal * 100, 
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: fullAddress,
        payment_method: paymentMethod === "ONLINE" ? "Razorpay" : "COD",
        payment_status: paymentId === "COD" ? "pending" : "paid",
      };

      await orderService.createOrder(orderData);
      
      if (!buyNowId) clearCart();

      setOrderModalOpen(true, {
        productName: activeItems.length === 1 ? activeItems[0].name : `${activeItems.length} Multiple Pieces`,
        amount: activeTotal
      });
      router.push("/");
    } catch (error: any) {
      console.error("❌ Order Finalization Failure:", error.message);
      setErrorModalOpen(true, {
        title: "Order Fulfillment Error",
        subtitle: error.message || "We encountered an issue with stock or price verification.",
        buttonText: "Revise Selection"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Header />
        <div className="w-12 h-12 border-2 border-accent-dark border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing Selection</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT: UPGRADED Checkout Form */}
            <div className="lg:col-span-7">
              <Link 
                href="/cart" 
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-black/30 hover:text-black transition-colors mb-12"
              >
                <ArrowLeft size={14} /> Back To Selection
              </Link>
              
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-12 italic">
                Secure Your <br /> <span className="not-italic">Masterpiece.</span>
              </h1>

              <form onSubmit={handleCheckout} className="space-y-12">
                {/* 1. Fulfillment Details */}
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-10 border-b border-black/5 pb-4">
                    1. Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors"
                        placeholder="e.g. Aaryan Malhotra"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors"
                        placeholder="10-digit Mobile No"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Delivery Address */}
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-10 border-b border-black/5 pb-4">
                    2. Shipping Architecture
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pincode with Loading State */}
                    <div className="md:col-span-1">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">
                        Pincode {pincodeLoading && <span className="text-accent ml-2 normal-case animate-pulse italic">— Verifying Location...</span>}
                      </label>
                      <input 
                        type="tel" 
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors"
                        placeholder="6-digit PIN Code"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">House / Flat No.</label>
                      <input 
                        type="text" 
                        required
                        value={formData.house}
                        onChange={(e) => setFormData({...formData, house: e.target.value})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors"
                        placeholder="e.g. 22A, Regency Apartments"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">Area / Street / Colony</label>
                      <input 
                        type="text" 
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors"
                        placeholder="e.g. Civil Lines"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">Landmark (Optional – Helps faster delivery)</label>
                      <input 
                        type="text" 
                        value={formData.landmark}
                        onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors italic"
                        placeholder="e.g. Near Metro Station"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">City / District</label>
                      <input 
                        type="text" 
                        readOnly={!manualMode}
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className={`w-full border border-black/5 p-5 text-sm outline-none ${manualMode ? 'bg-white focus:border-black' : 'bg-black/[0.02] text-black/40 cursor-not-allowed'}`}
                        placeholder={manualMode ? "Enter City" : "Auto-filled via PIN"}
                      />
                    </div>

                    <div>
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">State</label>
                      <input 
                        type="text" 
                        readOnly={!manualMode}
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className={`w-full border border-black/5 p-5 text-sm outline-none ${manualMode ? 'bg-white focus:border-black' : 'bg-black/[0.02] text-black/40 cursor-not-allowed'}`}
                        placeholder={manualMode ? "Enter State" : "Auto-filled via PIN"}
                      />
                    </div>
                  </div>
                  {manualMode && (
                    <p className="text-[10px] font-black uppercase text-accent mt-6">
                      ⚠️ Could not verify PIN automatically. Manual entry enabled.
                    </p>
                  )}
                </section>

                {/* 3. Payment Selection */}
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-8 border-b border-black/5 pb-4">
                    3. Payment Paradigm
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-6 border flex items-center gap-4 transition-all ${
                        paymentMethod === "COD" ? "border-black bg-black text-white" : "border-black/5 bg-white hover:border-black/20"
                      }`}
                    >
                      <Banknote size={20} />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest">Cash on Delivery</p>
                        <p className="text-[9px] opacity-60 uppercase mt-1">Pay when you receive</p>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ONLINE")}
                      className={`p-6 border flex items-center gap-4 transition-all ${
                        paymentMethod === "ONLINE" ? "border-black bg-black text-white" : "border-black/5 bg-white hover:border-black/20"
                      }`}
                    >
                      <CreditCard size={20} />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest">Online Payment</p>
                        <p className="text-[9px] opacity-60 uppercase mt-1">Pay via Razorpay</p>
                      </div>
                    </button>
                  </div>
                </section>

                <button 
                  type="submit"
                  disabled={isProcessing || (pincodeLoading && !manualMode)}
                  className="w-full bg-black text-white py-6 text-[12px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
                >
                  {isProcessing ? "Processing Artflow..." : `Fulfill Order - ₹${activeTotal.toLocaleString()}`}
                </button>
              </form>
            </div>

            {/* RIGHT: Selection Recap */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-black/5 p-10 sticky top-40 rounded-sm">
                <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-10 border-b border-black/5 pb-6">
                  Final Selection Recap
                </h2>
                
                <div className="space-y-6 mb-12">
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-[#FBF9F4] flex-shrink-0">
                        <img 
                          src={item.colors?.[0]?.images?.[0]} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-serif truncate w-40">{item.name}</p>
                        <p className="text-[10px] font-black tracking-widest text-black/40 mt-1 uppercase">
                          Qty: {item.quantity} × ₹{item.selling_price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-black text-right">₹{(item.selling_price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-10 border-t border-black/5 pt-10">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-black/30">
                    <span>Subtotal</span>
                    <span className="text-black">₹{activeTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-black/30">
                    <span>Shipping</span>
                    <span className="text-black">₹0</span>
                  </div>
                  <div className="flex justify-between items-center pt-6">
                    <span className="text-[12px] uppercase tracking-[0.3em] font-black italic">Total Investment</span>
                    <span className="text-2xl font-black">₹{activeTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-10 border-t border-black/5">
                  <div className="flex items-center gap-4 text-black/30">
                    <ShieldCheck size={18} strokeWidth={1} />
                    <span className="text-[9px] uppercase tracking-widest font-bold italic">Handcrafted Authentication Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-4 text-black/30">
                    <Truck size={18} strokeWidth={1} />
                    <span className="text-[9px] uppercase tracking-widest font-bold italic">Direct Artisan Fulfillment Loop</span>
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
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black/5 rounded-full" />
          <div className="h-4 w-48 bg-black/5 rounded" />
        </div>
      </div>
    }>
      <CheckoutPage />
    </Suspense>
  );
}
