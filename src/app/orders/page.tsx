"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Package, Truck, CheckCircle, Clock, Search } from "lucide-react";
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
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-sans font-medium text-black">Your Orders</h1>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input 
                  type="text" 
                  placeholder="Search all orders" 
                  className="w-full border border-black/20 rounded-md py-2 pl-10 pr-4 text-sm outline-none focus:border-[#FFD814] focus:ring-2 focus:ring-[#FFD814]/30"
                />
              </div>
              <button className="bg-[#333] hover:bg-black text-white px-4 py-2 rounded-full text-sm font-sans transition-colors whitespace-nowrap">
                Search Orders
              </button>
            </div>
          </div>

          {/* Amazon-style Tabs */}
          <div className="flex border-b border-black/10 mb-8 gap-6 overflow-x-auto custom-scrollbar-hide">
            <button className="text-sm font-bold font-sans text-amber-700 border-b-2 border-amber-700 pb-2 whitespace-nowrap">
              Orders
            </button>
            <button className="text-sm font-sans text-cyan-700 hover:text-amber-700 pb-2 whitespace-nowrap">
              Buy Again
            </button>
            <button className="text-sm font-sans text-cyan-700 hover:text-amber-700 pb-2 whitespace-nowrap">
              Not Yet Shipped
            </button>
            <button className="text-sm font-sans text-cyan-700 hover:text-amber-700 pb-2 whitespace-nowrap">
              Cancelled Orders
            </button>
          </div>

          <AnimatePresence mode="wait">
            {orders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center border border-black/5 bg-white rounded-sm"
              >
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-black/20">
                  <Package size={32} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-sans mb-4">Looks like you haven't placed an order in the last 3 months.</h3>
                <Link 
                  href="/shop"
                  className="inline-block bg-transparent text-cyan-700 hover:text-amber-700 hover:underline font-sans text-sm"
                >
                  View orders in 2025
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm font-bold font-sans mb-4">{orders.length} orders placed</p>

                {orders.map((order, idx) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border border-black/10 rounded-lg overflow-hidden bg-white"
                  >
                    {/* Header (Grey Background) */}
                    <div className="bg-[#F2F2F2] border-b border-black/10 p-4 flex flex-col md:flex-row justify-between text-sm font-sans text-[#565959]">
                      <div className="flex gap-10">
                        <div className="space-y-1">
                          <p className="uppercase text-xs font-semibold">Order Placed</p>
                          <p>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="uppercase text-xs font-semibold">Total</p>
                          <p>₹{(order.total_amount / 100).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1 hidden sm:block">
                          <p className="uppercase text-xs font-semibold">Ship To</p>
                          <p className="text-cyan-700 hover:text-amber-700 hover:underline cursor-pointer">
                            {order.customer_name || user?.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 text-left md:text-right space-y-1">
                        <p className="uppercase text-xs font-semibold">Order # {order.id.slice(0, 16).toUpperCase()}</p>
                        <div className="flex items-center gap-2 md:justify-end text-cyan-700">
                          <a href="#" className="hover:text-amber-700 hover:underline">View order details</a>
                          <span className="text-black/20">|</span>
                          <a href="#" className="hover:text-amber-700 hover:underline">Invoice</a>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-bold font-sans text-emerald-800 flex items-center gap-2 mb-1">
                          {order.status === 'pending' ? 'Arriving soon' : 
                           order.status === 'delivered' ? 'Delivered' : 'Processing order'}
                        </h3>
                        <p className="text-sm font-sans text-black/60">
                          Your package is being handled with care by our artisans.
                        </p>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-grow space-y-6">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex gap-6">
                              <div className="w-20 h-20 bg-[#F5F5F0] flex-shrink-0 rounded-sm overflow-hidden">
                                <img 
                                  src={item.products?.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                                  alt={item.products?.name} 
                                  className="w-full h-full object-contain p-1 mix-blend-multiply"
                                />
                              </div>
                              <div className="flex-grow space-y-1">
                                <a href={`/product/${item.products?.id}`} className="text-sm font-medium font-sans text-cyan-700 hover:text-amber-700 hover:underline line-clamp-2">
                                  {item.products?.name}
                                </a>
                                <p className="text-xs text-black/60 font-sans">
                                  Return window closed
                                </p>
                                <div className="mt-2">
                                  <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full px-4 py-1.5 text-xs font-sans shadow-sm transition-all flex items-center gap-2">
                                    <ShoppingBag size={12} />
                                    Buy it again
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons Column */}
                        <div className="w-full md:w-64 flex-shrink-0 space-y-2 mt-4 md:mt-0">
                          <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-2 px-4 text-sm font-sans shadow-sm transition-all text-center">
                            Track package
                          </button>
                          <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-2 px-4 text-sm font-sans shadow-sm transition-all text-center">
                            Return or replace items
                          </button>
                          <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-2 px-4 text-sm font-sans shadow-sm transition-all text-center">
                            Share gift receipt
                          </button>
                          <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-full py-2 px-4 text-sm font-sans shadow-sm transition-all text-center">
                            Write a product review
                          </button>
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
