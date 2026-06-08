"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Plus, Minus, MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Our handcrafted pieces typically dispatch within 3-5 business days. Delivery across India takes an additional 3-7 days depending on your location."
  },
  {
    question: "Do you offer custom tailoring or bespoke prints?",
    answer: "At this time, we do not offer custom tailoring. Our pieces are curated in limited batches to maintain the highest quality of artisanal craftsmanship."
  },
  {
    question: "What is your return and exchange policy?",
    answer: "We accept returns and exchanges within 7 days of delivery, provided the item is unused, unwashed, and in its original packaging with all tags attached."
  },
  {
    question: "How should I care for my block-printed fabrics?",
    answer: "We recommend gentle hand washing in cold water separately. Avoid soaking and dry in the shade to preserve the vibrant natural dyes of Sanganeri and Gujarati prints."
  }
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([{ name, email, message }]);

      if (error) throw error;

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-background transition-colors duration-500">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24">
        
        {/* Hero Section with Editorial Image */}
        <section className="relative h-[50vh] md:h-[65vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden mb-16 md:mb-24">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/home-page-image/small-tote.jpg" 
              alt="YDA Craftsmanship" 
              fill 
              className="object-cover object-center opacity-80 dark:opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/60" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-4 italic">
              Client Care
            </h1>
            <p className="text-xs md:text-xs uppercase tracking-widest font-black opacity-80">
              Personalized Assistance & Inquiries
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column: Contact Info & WhatsApp */}
            <div className="lg:col-span-5 space-y-12">
              
              {/* WhatsApp Priority CTA */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <MessageCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-lg font-serif italic dark:text-white">Instant Assistance</h2>
                </div>
                <p className="text-sm text-black/60 dark:text-white/60 mb-8 leading-relaxed">
                  For immediate support regarding sizing, fabric details, or order tracking, connect with our artisan specialists directly.
                </p>
                <a 
                  href="https://wa.me/917877646756?text=Hello%20YDA!%20I%20need%20assistance." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-emerald-600 text-white py-4 text-xs uppercase tracking-wider font-black hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  <MessageCircle size={16} />
                  WhatsApp Us
                </a>
              </motion.div>

              {/* Contact Details */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-10 dark:text-white"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 text-black/60 dark:text-white/60">
                    <Clock size={16} />
                    <h3 className="text-xs uppercase tracking-wider font-black">Operating Hours</h3>
                  </div>
                  <p className="font-serif text-lg">Mon - Sat, 10:00 AM — 7:00 PM (IST)</p>
                  <p className="text-xs text-black/70 dark:text-white/70 mt-2 font-sans">We aim to respond to all inquiries within 24 hours.</p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4 text-black/60 dark:text-white/60">
                    <Mail size={16} />
                    <h3 className="text-xs uppercase tracking-wider font-black">Digital Correspondence</h3>
                  </div>
                  <a href="mailto:support@ydafashions.com" className="text-xl font-serif hover:text-accent-dark transition-colors">
                    support@ydafashions.com
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4 text-black/60 dark:text-white/60">
                    <Phone size={16} />
                    <h3 className="text-xs uppercase tracking-wider font-black">Direct Lines</h3>
                  </div>
                  <div className="space-y-3 font-serif text-lg">
                    <p className="flex justify-between max-w-xs"><span>Client Care:</span> <a href="tel:+917877646756" className="hover:text-accent-dark transition-colors">+91 78776 46756</a></p>
                    <p className="flex justify-between max-w-xs"><span>Business:</span> <a href="tel:+919928569484" className="hover:text-accent-dark transition-colors">+91 99285 69484</a></p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4 text-black/60 dark:text-white/60">
                    <MapPin size={16} />
                    <h3 className="text-xs uppercase tracking-wider font-black">Our Studios</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8 font-sans text-sm text-black/70 dark:text-white/70 leading-relaxed">
                    <div>
                      <strong className="block text-black dark:text-white mb-2 uppercase tracking-widest text-xs font-black">Main Office</strong>
                      Mangalam City<br />
                      Jaipur, Rajasthan<br />
                      India
                    </div>
                    <div>
                      <strong className="block text-black dark:text-white mb-2 uppercase tracking-widest text-xs font-black">Artisan Studio</strong>
                      Sanganer<br />
                      Jaipur, Rajasthan<br />
                      India
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Functional Contact Form */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-[#121212] p-8 md:p-14 border border-black/5 dark:border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-sm relative overflow-hidden h-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-black/5 dark:bg-white/10" />
                <h2 className="text-3xl font-serif mb-2 italic dark:text-white">Send a Message</h2>
                <p className="text-sm text-black/70 dark:text-white/70 mb-10">Prefer email? Fill out the form below and our concierge will get back to you.</p>
                
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center space-y-4"
                    >
                      <div className="w-20 h-20 bg-[#F9F9F7] dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <h3 className="text-2xl font-serif italic dark:text-white">Message Received</h3>
                      <p className="text-sm text-black/60 dark:text-white/60 max-w-xs">Thank you for reaching out. Our client care team will review your inquiry and respond shortly.</p>
                      <button 
                        onClick={() => setStatus("idle")}
                        className="mt-10 text-xs uppercase tracking-wider font-black text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors underline underline-offset-4"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-8" 
                      onSubmit={handleSubmit}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-xs uppercase tracking-widest font-black text-black/60 dark:text-white/60 mb-3 block">Full Name</label>
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 text-sm focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all dark:text-white" 
                            placeholder="Aaryan Malhotra" 
                            required 
                            disabled={status === "loading"}
                          />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest font-black text-black/60 dark:text-white/60 mb-3 block">Email Address</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 text-sm focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all dark:text-white" 
                            placeholder="you@example.com" 
                            required 
                            disabled={status === "loading"}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest font-black text-black/60 dark:text-white/60 mb-3 block">Your Inquiry</label>
                        <textarea 
                          rows={5} 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-[#F9F9F7] dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 text-sm focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-white/10 transition-all resize-none dark:text-white" 
                          placeholder="How may we assist you today?" 
                          required
                          disabled={status === "loading"}
                        ></textarea>
                      </div>

                      {status === "error" && (
                        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs p-4 uppercase tracking-widest font-black text-center border border-red-100 dark:border-red-500/20">
                          {errorMessage}
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className="w-full bg-black text-white dark:bg-white dark:text-black py-5 text-xs uppercase tracking-widest font-black hover:bg-accent-dark transition-colors disabled:opacity-50 shadow-xl"
                      >
                        {status === "loading" ? "Transmitting..." : "Submit Inquiry"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-24 md:mt-32 pt-24 border-t border-black/5 dark:border-white/5">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif italic mb-4 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-xs uppercase tracking-wider font-black text-black/60 dark:text-white/60">Quick Answers</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-[#F9F9F7] dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="font-serif text-lg dark:text-white">{faq.question}</span>
                    <span className="text-black/60 dark:text-white/60 ml-4 shrink-0">
                      {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 md:p-8 pt-0 text-sm text-black/60 dark:text-white/60 leading-relaxed border-t border-black/5 dark:border-white/5 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
