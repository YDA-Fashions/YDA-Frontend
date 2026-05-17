"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Database, Lock, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-background transition-colors duration-500">
      <Header />
      
      <main className="pt-24 pb-24">
        
        {/* Adjusted Editorial Hero Banner */}
        <section className="relative h-[35vh] md:h-[45vh] min-h-[250px] w-full flex items-center justify-center overflow-hidden mb-16 md:mb-24">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/home-page-image/small-tote.jpg" 
              alt="YDA Privacy" 
              fill
              className="object-cover object-center opacity-75 dark:opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-black/40 dark:bg-black/75" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center text-white px-6 pt-12 md:pt-16"
          >
            <h1 className="text-3xl md:text-5xl font-serif tracking-tight mb-3 italic">
              Privacy Policy
            </h1>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black opacity-80">
              Data Protection & Privacy Covenants
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Column: At a Glance Highlight Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 dark:text-white/40 mb-6 font-sans">Privacy Snapshot</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <ShieldCheck size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">Payment Security</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Processed securely via Razorpay. We do not store card credentials.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <Lock size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">Data Control</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">We never rent or sell your contact files to external marketing lists.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <Database size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">Cookie Usage</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Strictly to remember shopping carts and maintain account session security.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 dark:border-white/10 mt-8 pt-8">
                    <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed mb-4 font-sans">
                      Want to request complete file deletion or edit your account information?
                    </p>
                    <a 
                      href="mailto:support@ydafashions.com"
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-black dark:text-white hover:underline font-sans"
                    >
                      <Mail size={14} />
                      Contact Data Specialist
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
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">Data We Acquire</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      YDA Fashions ("we," "our," or "us"), operating under Avani Enterprises, prioritizes the integrity of your personal information. When you place a custom bag order, check out, or build an account profile, we securely acquire:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>**Identity Records:** Full name, registered shipping and billing addresses, email address, and active telephone numbers.</li>
                      <li>**Browsing Logs:** Analytical logs representing system interfaces, browser variations, IP coordinates, and cookie states.</li>
                    </ul>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">02 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">Usage Boundaries</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      Your personal data is protected under robust security layers and is strictly used to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Fulfill orders, compute currency transactions, and dispatch items from Jaipur.</li>
                      <li>Transmit critical logistics, custom fabric choices, and direct support updates via SMS/WhatsApp.</li>
                      <li>Facilitate marketing announcements (fully controlled by opt-out preferences).</li>
                    </ul>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">03 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">Logistical & Payment Gateways</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      We limit data exposure strictly to certified platforms required to run operations:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>**Razorpay:** Computes transactions under rigid PCI-DSS security layers.</li>
                      <li>**Logistic partners (e.g., Shiprocket):** Receive shipping coordinates for delivery.</li>
                      <li>**Google & Meta Analytics:** Process anonymized traffic data to diagnose platform speed and performance.</li>
                    </ul>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">04 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">Cookies & Sessions</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      We deploy essential cookies to stabilize cart states, protect login sessions, and optimize checkout. You can manage or disable cookie configurations within your web browser settings.
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
