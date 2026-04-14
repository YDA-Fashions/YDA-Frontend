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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);

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
    // 1. Session Hydration Guard
    const { isLoading, user } = useAuthStore.getState();
    if (isLoading) return; 

    // 2. Auth Guard
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    // 3. Inventory Guard: Must have items to checkout
    if (activeItems.length === 0 && !isAuthLoading) {
      router.push("/cart");
    }
  }, [activeItems.length, router, isAuthLoading]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Field Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorModalOpen(true, {
        title: "Incomplete Details",
        subtitle: "Please provide your full name, phone, and shipping address.",
        buttonText: "Revise Selection"
      });
      return;
    }

    // STRICT FINANCIAL VALIDATION (No Fallback 0)
    if (!activeTotal || activeTotal <= 0) {
      console.error("❌ Checkout Blocked: Invalid total", activeTotal);
      setErrorModalOpen(true, {
        title: "Selection Error",
        subtitle: "Your order total is invalid. Please return to the shop.",
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
          amount: activeTotal * 100, // Amount in paise
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
          theme: {
            color: "#1A1A1A",
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
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
      // DEBUG: Verify payload before transmission
      console.log("🚀 Initializing Finalization:", {
        amount_paise: activeTotal * 100,
        items_count: activeItems.length,
        is_buy_now: !!buyNowId
      });

      const orderData = {
        user_id: user?.id,
        items: activeItems,
        amount: activeTotal * 100, 
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: formData.address.trim(),
        payment_method: paymentMethod === "ONLINE" ? "Razorpay" : "COD",
        payment_status: paymentId === "COD" ? "pending" : "paid",
      };

      await orderService.createOrder(orderData);
      
      // Clear cart only if this wasn't a Buy Now flow
      if (!buyNowId) clearCart();

      setOrderModalOpen(true, {
        productName: activeItems.length === 1 ? activeItems[0].name : `${activeItems.length} Multiple Pieces`,
        amount: activeTotal
      });
      router.push("/");
    } catch (error: any) {
      // EXPOSE DETAILED ERROR
      console.error("❌ Order Finalization Failure:", error.message, error.details);
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
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-12 h-12 border-2 border-accent-dark border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-accent-dark">Synchronizing Account</p>
          <h2 className="text-2xl font-serif italic">Masterpiece curation in progress...</h2>
        </motion.div>
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
            
            {/* LEFT: Checkout Form */}
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
                {/* Shipping Details */}
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-8 border-b border-black/5 pb-4">
                    1. Fulfillment Details
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
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-black/40 mb-3 block">Full Address</label>
                      <textarea 
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-white border border-black/5 p-5 text-sm outline-none focus:border-black transition-colors min-h-[120px]"
                        placeholder="House No, Street, Landmark, City, Pincode"
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Selection */}
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.4em] font-black mb-8 border-b border-black/5 pb-4">
                    2. Payment Method
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
                        <p className="text-[9px] opacity-60 uppercase mt-1">Pay via Razorpay (Safe & Secure)</p>
                      </div>
                    </button>
                  </div>
                </section>

                  <button 
                    type="submit"
                    disabled={isProcessing}
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
