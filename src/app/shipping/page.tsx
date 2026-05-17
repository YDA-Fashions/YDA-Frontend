"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";
import { Truck, Clock, ShieldCheck, MessageCircle } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-background transition-colors duration-500">
      <Header />
      
      <main className="pt-32 pb-24 md:pt-40">
        
        {/* Minimalist Premium Typography Header */}
        <section className="container mx-auto px-6 max-w-7xl mb-16 md:mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/40 dark:text-white/40 block">YDA Fashions</span>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-black dark:text-white italic">
              Shipping Policy
            </h1>
            <div className="w-16 h-[1px] bg-black/10 dark:bg-white/10 mx-auto mt-6 mb-4" />
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-black/50 dark:text-white/50">
              Artisan Curation & Delivery Timelines
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Column: At a Glance Highlight Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 dark:text-white/40 mb-6">At a Glance</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <Clock size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1">Fulfillment Time</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">5 to 8 business days across India.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <Truck size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1">Dispatch Hub</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Shipped directly from our atelier in Jaipur, Rajasthan.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <ShieldCheck size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1">Tracking Included</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Live tracking link provided via SMS/WhatsApp on dispatch.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 dark:border-white/10 mt-8 pt-8">
                    <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed mb-4">
                      Need custom dispatch options or urgent delivery for a special occasion?
                    </p>
                    <a 
                      href="https://wa.me/917877646756?text=Hello%20YDA!%20I%20have%20a%20shipping%20query."
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <MessageCircle size={14} />
                      Inquire via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Styled Policy Panels */}
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-white dark:bg-[#121212] p-8 md:p-12 border border-black/5 dark:border-white/10 shadow-sm space-y-10">
                
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">01 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black">Processing & Delivery Timelines</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4">
                    <p>
                      At YDA Fashions, we practice slow, intentional luxury. Because each piece in our Sanganeri and Gujarati collections is crafted using artisanal techniques and undergoes thorough quality checks before packaging, please allow **5 to 8 business days** for your curated selection to arrive.
                    </p>
                    <p>
                      Our delivery cycle consists of a detailed dispatch assessment at our Jaipur studios followed by secure transit via our premium logistical partners.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">02 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black">Shipping Charges & Tiers</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4">
                    <p>
                      Shipping fees, where applicable, are dynamically calculated based on consignment weight and parcel dimensions. The exact fee structure will be transparently presented to you at the checkout portal before finalizing your transaction.
                    </p>
                    <p>
                      From time to time, we offer complimentary delivery across India for special promotional periods or order values that cross specific premium tiers.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">03 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black">Delivery & Addresses</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4">
                    <p>
                      To prevent dispatch complications, please provide a complete and accurate physical address along with an active phone contact. We are unable to route packages to P.O. Boxes or incomplete local landmarks.
                    </p>
                    <p>
                      In the event that a shipment is returned to our Jaipur studio due to an incorrect address, non-availability of the recipient, or continuous delivery refusal, YDA Fashions reserves the right to charge nominal re-shipping fees to arrange a secondary delivery.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">04 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black">Cash on Delivery (COD)</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4">
                    <p>
                      We extend Cash on Delivery (COD) services as a luxury of choice to our patrons. However, we request that you ensure cash availability and your physical presence during the designated delivery window.
                    </p>
                    <p>
                      Patrons who repeatedly refuse or fail to accept Cash on Delivery parcels without valid cause may face restriction from placing future COD orders, limiting their transaction choices to prepaid options.
                    </p>
                  </div>
                </section>

              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
