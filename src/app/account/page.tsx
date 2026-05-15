"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Mail, Shield, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { orderService } from "@/services/orderService";

const AccountPage = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, signOut } = useAuthStore();
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthLoading) return;
      if (!user) {
        router.push("/login?redirect=/account");
        return;
      }

      try {
        const orders = await orderService.getOrders(user.id);
        if (orders && orders.length > 0) {
          setLastOrder(orders[0]); // Get most recent order for address
        }
      } catch (error) {
        console.error("Failed to fetch account data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-[10px] uppercase tracking-[0.5em] font-black">Identifying...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBFA]">
      <Header />
      
      <main className="pt-28 pb-24 md:pt-40">
        <div className="container mx-auto px-6 max-w-4xl">
          
          <div className="mb-12 md:mb-16 border-b border-black/5 pb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-black/40 hover:text-black transition-colors mb-8"
            >
              <ArrowLeft size={14} /> Back to Studio
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-black">
              Your Profile
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: ID & Basic Info */}
            <div className="md:col-span-1 space-y-8">
              <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-6">
                  <User size={32} strokeWidth={1} />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-black/40 mb-1">User ID</p>
                    <p className="text-xs font-mono break-all text-black/60">{user?.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-black/40 mb-1">Email</p>
                    <p className="text-sm font-sans font-bold">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="w-full mt-8 py-3 border border-black text-[10px] uppercase tracking-widest font-black hover:bg-black hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Address & Orders */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Address Box */}
              <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={20} className="text-black" />
                  <h3 className="text-lg font-serif italic">Saved Shipping Address</h3>
                </div>
                
                {lastOrder ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#FBF9F4] border border-black/5 rounded-sm">
                      <p className="text-sm font-sans leading-relaxed text-black/80">
                        {lastOrder.shipping_address}
                      </p>
                    </div>
                    <p className="text-[10px] text-black/40 italic">
                      *Address automatically updated from your last order (#{lastOrder.id.slice(0,8).toUpperCase()})
                    </p>
                  </div>
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-black/5 rounded-sm">
                    <p className="text-xs uppercase tracking-widest text-black/30">No address saved yet</p>
                    <Link href="/shop" className="text-[10px] uppercase tracking-widest font-bold mt-4 inline-block hover:underline">
                      Make your first order
                    </Link>
                  </div>
                )}
              </div>

              {/* Order History Shortcut */}
              <div className="bg-black text-white p-8 rounded-sm shadow-xl flex items-center justify-between group cursor-pointer" onClick={() => router.push('/orders')}>
                <div>
                  <h3 className="text-xl font-serif italic mb-2">Order History</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/60">View all your previous masterpieces</p>
                </div>
                <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Package size={20} />
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

export default AccountPage;
