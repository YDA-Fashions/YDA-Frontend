"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24 md:pt-48">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
              Get in <span className="italic">Touch</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-foreground/40">
              We are here to assist you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16">
            
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-12"
            >
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/40 mb-4">Digital Correspondence</h3>
                <a href="mailto:support@ydafashions.com" className="text-xl font-serif hover:text-accent-dark transition-colors">
                  support@ydafashions.com
                </a>
              </div>

              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/40 mb-4">Direct Lines</h3>
                <div className="space-y-2 font-serif text-lg">
                  <p>Customer Care: <a href="tel:+917877646756" className="hover:text-accent-dark transition-colors">+91 78776 46756</a></p>
                  <p>Business Inquiries: <a href="tel:+919928569484" className="hover:text-accent-dark transition-colors">+91 99285 69484</a></p>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground/40 mb-4">Our Studios</h3>
                <div className="space-y-6 font-sans text-sm text-foreground/80 leading-relaxed">
                  <div>
                    <strong className="block text-foreground mb-1">Main Office</strong>
                    Mangalam City<br />
                    Jaipur, Rajasthan<br />
                    India
                  </div>
                  <div>
                    <strong className="block text-foreground mb-1">Second Office</strong>
                    Sanganer<br />
                    Jaipur, Rajasthan<br />
                    India
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Functional Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 md:p-12 border border-border-beige shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-md relative overflow-hidden"
            >
              <h2 className="text-2xl font-serif mb-8">Send a Message</h2>
              
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-xl font-serif">Message Received</h3>
                    <p className="text-sm text-foreground/60">Thank you for reaching out. Our team will get back to you shortly.</p>
                    <button 
                      onClick={() => setStatus("idle")}
                      className="mt-8 text-[10px] uppercase tracking-[0.2em] font-bold text-accent-dark hover:text-foreground transition-colors"
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
                    className="space-y-6" 
                    onSubmit={handleSubmit}
                  >
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Your Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors" 
                        placeholder="Full Name" 
                        required 
                        disabled={status === "loading"}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors" 
                        placeholder="you@example.com" 
                        required 
                        disabled={status === "loading"}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Message</label>
                      <textarea 
                        rows={4} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors resize-none" 
                        placeholder="How can we help you?" 
                        required
                        disabled={status === "loading"}
                      ></textarea>
                    </div>

                    {status === "error" && (
                      <div className="bg-red-50 text-red-500 text-[10px] p-4 uppercase tracking-widest font-bold text-center">
                        {errorMessage}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === "loading"}
                      className="w-full bg-foreground text-background py-5 text-[10px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent-dark transition-colors disabled:opacity-50"
                    >
                      {status === "loading" ? "Sending..." : "Send Inquiry"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
