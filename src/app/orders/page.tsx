"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { orderService } from "@/services/orderService";

const OrdersPage = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Session Guard
      if (isAuthLoading) return;
      if (!user) {
        router.push("/login?redirect=/orders");
        return;
      }

      try {
        const data = await orderService.getOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error("❌ Failed to fetch order history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthLoading, router]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <CheckCircle size={14} className="text-emerald-500" />;
      case "delivered": return <Package size={14} className="text-emerald-600" />;
      case "shipped": return <Truck size={14} className="text-blue-500" />;
      default: return <Clock size={14} className="text-amber-500" />;
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex flex-col items-center justify-center">
        <Header />
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black/5 rounded-full" />
          <div className="h-4 w-48 bg-black/5 rounded" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-black/5 pb-10">
            <div>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-black/30 hover:text-black transition-colors mb-8"
              >
                <ArrowLeft size={14} /> Back to Studio
              </Link>
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight italic">
                Your <span className="not-italic ml-4">Legacy.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40 mt-6">
                Curated Selection & Order History
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-black/20">Authenticated As</span>
              <p className="text-sm font-serif italic text-black/60">{user?.email}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {orders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-32 text-center"
              >
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8 text-black/20">
                  <ShoppingBag size={32} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-serif italic text-black/40 mb-10">Your archive is currently empty.</h3>
                <Link 
                  href="/shop"
                  className="inline-block bg-black text-white px-12 py-5 text-[11px] uppercase tracking-[0.4em] font-black hover:bg-black/90 transition-all shadow-xl"
                >
                  Discover New Masterpieces
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {orders.map((order, idx) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-black/5 p-8 md:p-12 rounded-sm group hover:shadow-sm transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-10 border-b border-black/5 pb-8">
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/30">Order Reference</p>
                        <p className="text-xs font-black">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/30">Date Placed</p>
                        <p className="text-xs font-black">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/30">Total Value</p>
                        <p className="text-sm font-black">₹{(order.total_amount / 100).toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/30">Current Status</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="text-[10px] font-black uppercase tracking-widest italic">{order.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/20">Line Items</p>
                        <div className="space-y-4">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex gap-4 items-center">
                              <div className="w-12 h-12 bg-[#FBF9F4] flex-shrink-0 p-2 border border-black/5">
                                <img 
                                  src={item.products?.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                                  alt={item.products?.name} 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex-grow">
                                <p className="text-xs font-serif italic truncate w-48">{item.products?.name}</p>
                                <p className="text-[9px] font-black text-black/40 mt-1">QTY: {item.quantity} × ₹{(item.price_at_purchase / 100).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6 md:border-l md:border-black/5 md:pl-12">
                        <p className="text-[9px] uppercase tracking-widest font-black text-black/20">Fulfillment Target</p>
                        <div className="space-y-4">
                          <p className="text-xs font-sans text-black/60 leading-relaxed max-w-xs italic">
                            {order.shipping_address}
                          </p>
                          <div className="pt-4 flex items-center gap-3">
                             <CheckCircle size={14} className="text-emerald-500" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-black/40">Handcrafted Authentication Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
