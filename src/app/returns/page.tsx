"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";
import { AlertCircle, Clock, FileVideo, MessageCircle } from "lucide-react";

export default function ReturnsPolicy() {
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
            <span className="text-xs uppercase tracking-widest font-black text-black/60 dark:text-white/60 block">YDA Fashions</span>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-black dark:text-white italic">
              Returns & Refunds
            </h1>
            <div className="w-16 h-[1px] bg-black/10 dark:bg-white/10 mx-auto mt-6 mb-4" />
            <p className="text-xs md:text-xs uppercase tracking-wider font-medium text-black/70 dark:text-white/70">
              Assurance, Authentication, & Claims
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Strict Requirements Highlights */}
            <div className="w-full lg:w-[35%] shrink-0">
              <div className="lg:sticky lg:top-32 space-y-8">
                <div className="bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-8 shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider font-black text-black/60 dark:text-white/60 mb-6 font-sans">Strict Requirements</h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="text-amber-600 dark:text-amber-500 shrink-0 mt-1">
                        <AlertCircle size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">Eligibility</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Strictly for damaged or defective items only. Change of mind is not accepted.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-amber-600 dark:text-amber-500 shrink-0 mt-1">
                        <Clock size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">48-Hour Deadline</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">Damages must be reported within 48 hours of delivery.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-amber-600 dark:text-amber-500 shrink-0 mt-1">
                        <FileVideo size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-black dark:text-white mb-1 font-sans">Unboxing Video</h4>
                        <p className="text-sm text-black/60 dark:text-white/60">A continuous, unedited unboxing video is mandatory to register claims.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 dark:border-white/10 mt-8 pt-8">
                    <p className="text-xs text-black/70 dark:text-white/70 leading-relaxed mb-4 font-sans">
                      Received a damaged parcel? Send your unboxing video immediately to our care specialists.
                    </p>
                    <a 
                      href="https://wa.me/917877646756?text=Hello%20YDA!%20I%20wish%20to%20submit%20an%20unboxing%20video%20for%20a%20damaged%20parcel."
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-black text-emerald-600 dark:text-emerald-400 hover:underline font-sans"
                    >
                      <MessageCircle size={14} />
                      Submit Video on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Styled Policy Panels */}
            <div className="w-full lg:w-[65%] space-y-12">
              <div className="bg-white dark:bg-[#121212] p-8 md:p-12 border border-black/5 dark:border-white/10 shadow-sm space-y-10">
                
                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/60 dark:text-white/60">
                    <span className="font-serif italic text-lg">01 /</span>
                    <h2 className="text-xs uppercase tracking-wider font-black font-sans">Eligibility for Claims</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      At YDA Fashions, we stand unconditionally behind the physical integrity of our artisan curations. Because our bags and cushions are made in strictly limited quantities using delicate, hand-blocked textiles, **we do not accept returns for change of mind or personal design preferences**.
                    </p>
                    <p className="font-bold text-amber-700 dark:text-amber-400">
                      Returns are strictly limited to instances where a parcel is received with physical damage, structural defects, or as an incorrect shipment.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/60 dark:text-white/60">
                    <span className="font-serif italic text-lg">02 /</span>
                    <h2 className="text-xs uppercase tracking-wider font-black font-sans">Mandatory Unboxing Video</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      To ensure high standards of authenticity and eliminate transit disputes, YDA Fashions mandates an **unedited, continuous unboxing video** as proof for any damage claims.
                    </p>
                    <div className="bg-[#FAF9F6] dark:bg-white/5 p-6 border-l-2 border-black/20 dark:border-white/20 my-4 space-y-2">
                      <strong className="block text-xs uppercase tracking-widest text-black dark:text-white">Unboxing Video Guidelines:</strong>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>The camera must capture the sealed parcel and shipping label clearly before opening.</li>
                        <li>The recording must be continuous with no cuts, edits, pauses, or camera transitions.</li>
                        <li>The opening of the box/bag and the discovery of the physical damage must be shown clearly in the frame.</li>
                      </ul>
                    </div>
                    <p>
                      Failure to submit this video within **48 hours of delivery** to support@ydafashions.com or via WhatsApp at **+91 78776 46756** will result in the immediate rejection of the claim.
                    </p>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/60 dark:text-white/60">
                    <span className="font-serif italic text-lg">03 /</span>
                    <h2 className="text-xs uppercase tracking-wider font-black font-sans">Non-Returnable Thresholds</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      To protect our patrons and maintain strict standards of fabric hygiene, the following items are completely ineligible for replacement or return:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Consignments showing signs of usage, washing, alterations, or direct ironing.</li>
                      <li>Products shipped back without their original branded box, tag attachments, or packaging material.</li>
                      <li>Customized blocks or print orders specifically commissioned by the client.</li>
                      <li>**Artisan Variation:** Because our fabrics are printed by hand block printers using heritage dyes, slight color variations, minor pattern asymmetry, or micro dye splatters are natural characteristics of heritage craftsmanship and do not constitute structural damage.</li>
                    </ul>
                  </div>
                </section>

                <div className="h-px bg-black/5 dark:bg-white/10" />

                <section className="space-y-4">
                  <div className="flex items-center gap-3 text-black/60 dark:text-white/60">
                    <span className="font-serif italic text-lg">04 /</span>
                    <h2 className="text-xs uppercase tracking-wider font-black font-sans">Refund Disbursals</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert text-black/70 dark:text-white/70 max-w-none leading-relaxed space-y-4 font-sans">
                    <p>
                      Once our quality inspection team in Jaipur validates the defect from your unboxing proof, we will approve the request and process a full refund.
                    </p>
                    <p>
                      Refunds are automatically processed to your original payment gateway (Razorpay). For Cash on Delivery transactions, a bank transfer will be scheduled. Please expect the credit to appear in your account within **5 to 7 business days** post-approval.
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
