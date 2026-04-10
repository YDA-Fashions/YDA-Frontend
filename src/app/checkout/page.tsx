"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { orderService } from "@/services/orderService";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { setOrderModalOpen, setErrorModalOpen } = useUIStore();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  const totalPrice = getTotalPrice();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorModalOpen(true, {
        title: "Incomplete Details",
        subtitle: "Please provide your full name, phone, and shipping address to proceed.",
        buttonText: "Revise Selection"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        user_id: user?.id,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          selling_price: item.selling_price,
          quantity: item.quantity,
          image: item.colors?.[0]?.images?.[0]
        })),
        amount: totalPrice,
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: formData.address.trim(),
        payment_method: paymentMethod,
        payment_status: paymentMethod === "ONLINE" ? "paid" : "pending"
      };

      console.log("📝 Final Audit: Preparing to submit order to Supabase...", orderData);
      
      await orderService.createOrder(orderData);
      
      clearCart();
      setOrderModalOpen(true, {
        productName: items.length === 1 ? items[0].name : `${items.length} Multiple Pieces`,
        amount: totalPrice
      });
      router.push("/");
    } catch (error: any) {
      setErrorModalOpen(true, {
        title: "Order Failed",
        subtitle: error.message || "Failed to place your order. Please try again.",
        buttonText: "Revise & Retry"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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

              <form onSubmit={handlePlaceOrder} className="space-y-12">
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
                      className={`p-6 border flex items-center gap-4 transition-all opacity-50 cursor-not-allowed ${
                        paymentMethod === "ONLINE" ? "border-black bg-black text-white" : "border-black/5 bg-white"
                      }`}
                    >
                      <CreditCard size={20} />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest">Online Payment</p>
                        <p className="text-[9px] opacity-60 uppercase mt-1">Razorpay (Coming Soon)</p>
                      </div>
                    </button>
                  </div>
                </section>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-6 text-[12px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50"
                >
                  {isProcessing ? "Authenticating Transaction..." : "Complete Your Order"}
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
                  {items.map((item) => (
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
                    <span className="text-black">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-black/30">
                    <span>Shipping</span>
                    <span className="text-black">₹0</span>
                  </div>
                  <div className="flex justify-between items-center pt-6">
                    <span className="text-[12px] uppercase tracking-[0.3em] font-black italic">Total Investment</span>
                    <span className="text-2xl font-black">₹{totalPrice.toLocaleString()}</span>
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

export default CheckoutPage;
