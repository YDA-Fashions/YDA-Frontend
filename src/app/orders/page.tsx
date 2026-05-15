"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Package, Truck, CheckCircle, Clock, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
          
          <div className="mb-12 md:mb-16 border-b border-black/5 pb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-black/40 hover:text-black transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to Studio
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-black">
              Your Order History
            </h1>
            <p className="text-xs uppercase tracking-widest text-black/40 mt-4 font-sans font-bold">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Placed
            </p>
          </div>

          <AnimatePresence mode="wait">
            {orders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-24 text-center bg-white border border-black/5 rounded-sm"
              >
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8 text-black/20">
                  <Package size={32} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-serif mb-6 text-black/60">Your order history is currently empty.</h3>
                <Link 
                  href="/shop"
                  className="inline-block bg-black text-white px-10 py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/90 transition-all shadow-md"
                >
                  Start Shopping
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-12">
                {orders.map((order, idx) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border border-black/10 rounded-sm bg-white p-6 md:p-10 shadow-sm"
                  >
                    {/* Order Details Header */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pb-8 border-b border-black/10 mb-8">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-black/40">Order Placed</p>
                        <p className="text-sm font-sans font-semibold">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-sans font-semibold text-emerald-800">
                          ₹{order.total_amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-black/40">Order Reference</p>
                        <p className="text-sm font-sans font-semibold">
                          #{order.id.slice(0, 12).toUpperCase()}
                        </p>
                      </div>
                      <div className="space-y-1 col-span-2 md:col-span-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-black/40">Status</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <p className="text-sm font-sans font-bold uppercase tracking-widest">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items & Shipping Address Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      
                      {/* Left: Products List (Large Images) */}
                      <div className="lg:col-span-2 space-y-8">
                        <p className="text-[11px] uppercase tracking-widest font-black text-black/30 border-b border-black/5 pb-2">Products</p>
                        
                        <div className="space-y-8">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-6 md:gap-10">
                              
                              {/* Large Product Image */}
                              <div className="w-full sm:w-48 md:w-56 aspect-square bg-[#F5F5F0] flex-shrink-0 rounded-sm overflow-hidden relative">
                                <Image 
                                  src={item.products?.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} 
                                  alt={item.products?.name} 
                                  fill
                                  className="object-contain p-4 mix-blend-multiply"
                                />
                              </div>
                              
                              {/* Product Info */}
                              <div className="flex-grow pt-2">
                                <Link href={`/product/${item.products?.id}`}>
                                  <h3 className="text-xl md:text-2xl font-serif mb-2 hover:underline">
                                    {item.products?.name}
                                  </h3>
                                </Link>
                                <p className="text-sm font-sans text-black/60 mb-6">
                                  Quantity: <span className="font-bold text-black">{item.quantity}</span>
                                </p>
                                <p className="text-lg font-sans font-bold text-black">
                                  ₹{item.price_at_purchase.toLocaleString()} <span className="text-xs font-normal text-black/40">(per item)</span>
                                </p>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Fulfillment & Address */}
                      <div className="lg:col-span-1">
                        <div className="bg-[#FBF9F4] border border-black/5 p-6 rounded-sm">
                          <p className="text-[11px] uppercase tracking-widest font-black text-black/30 mb-6 border-b border-black/5 pb-2">
                            Shipping Details
                          </p>
                          <div className="space-y-2 font-sans text-sm text-black/80">
                            <p className="font-bold text-black mb-2">{order.customer_name || user?.email}</p>
                            {order.customer_phone && <p className="mb-4">Phone: +91 {order.customer_phone}</p>}
                            <p className="leading-relaxed">
                              {order.shipping_address}
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-black/5 space-y-4">
                            <div className="flex items-center gap-3">
                              <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                              <span className="text-xs font-sans font-medium text-black/60">Authentication Verified</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Truck size={16} className="text-emerald-600 flex-shrink-0" />
                              <span className="text-xs font-sans font-medium text-black/60">Handled with Artisan Care</span>
                            </div>
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
