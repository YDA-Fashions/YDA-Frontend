"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Scale, AlertOctagon, FileText } from "lucide-react";

export default function TermsConditions() {
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
              Terms & Conditions
            </h1>
            <div className="w-16 h-[1px] bg-black/10 dark:bg-white/10 mx-auto mt-6 mb-4" />
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-black/50 dark:text-white/50">
              Legal Framework & Operating Conditions
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Left Column: At a Glance Highlight Sidebar */}
            <div className="w-full lg:w-[35%] shrink-0">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 shadow-sm">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 dark:text-white/40 mb-6 font-sans">Legal Snapshot</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <ShieldCheck size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">Parent Entity</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">YDA Fashions is a registered brand of Avani Enterprises.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <Scale size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">Jurisdiction</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Governed under Indian laws with legal jurisdiction in Jaipur, Rajasthan.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-black dark:text-white shrink-0 mt-1">
                        <AlertOctagon size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">COD Threshold</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Repeated COD delivery failure results in account checkout restrictions.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 dark:border-white/10 mt-8 pt-8">
                    <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed mb-4 font-sans">
                      Have specific queries regarding enterprise terms, wholesale commissions, or standard policies?
                    </p>
                    <a 
                      href="mailto:support@ydafashions.com"
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-black dark:text-white hover:underline font-sans"
                    >
                      <FileText size={14} />
                      Email Our Legal Team
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Styled Policy Panels */}
            <div className="w-full lg:w-[65%] space-y-12">
              <div className="bg-white dark:bg-[#121212] p-8 md:p-12 border border-black/5 dark:border-white/10 shadow-sm space-y-10">
                
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">01 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">General Conditions & Service</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      Welcome to YDA Fashions. By accessing or executing transactions on our portal (ydafashions.com), you unconditionally pledge adherence to the legal covenants and operating rules defined herein.
                    </p>
                    <p>
                      We reserve the unilateral authority to deny service, terminate cart privileges, or suspend user access for standard policy violations. Reproducing, mimicking, or exploiting any media, design assets, code patterns, or products from this platform without express written authorization is strictly prohibited.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">02 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">Artisan Integrity & Pricing</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      We strive to convey structural details, colors, and textures of our handcrafted selections as flawlessly as possible. However, because our bags and home decor feature hand-dyed and hand-blocked traditional textiles, minor dye variations, print overlapping, and texture inconsistencies are natural products of manual looms and do not constitute structural flaws.
                    </p>
                    <p>
                      We reserve the right to alter pricing, suspend products, or run collections in strictly limited cycles without advance announcements.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">03 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">Order Cancellations</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      Orders once placed can only be cancelled **before dispatch processing has commenced at our Jaipur hub**. Once transit labels have been generated or tracking links issued, we are unable to retract the parcel or offer active cancellations.
                    </p>
                    <p>
                      To request immediate cancellation post-purchase, please contact our helpline immediately with your invoice reference.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/40 dark:text-white/40">
                    <span className="font-serif italic text-lg">04 /</span>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black font-sans">Intellectual Property & Trademarks</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      All content published on this domain, including photography, site graphics, brand iconography, typography elements, product naming structures, and styling systems is the exclusive property of Avani Enterprises (trading as YDA Fashions) and is protected strictly by Indian and International Copyright legislation.
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
