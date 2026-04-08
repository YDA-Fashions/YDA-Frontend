"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    localStorage.setItem("yda-user", JSON.stringify({ email: "user@example.com", name: "Guest" }));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24 md:pt-48">
        <div className="container mx-auto px-6 max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-4">
              {isLogin ? "Welcome" : "Join"} <br /> <span className="italic ml-8 md:ml-16">The Studio.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-foreground/40">
              Access your curated collections
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  className="w-full bg-transparent border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors"
                />
              </div>
            )}
            
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Email Address</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                required
                className="w-full bg-transparent border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors"
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full bg-transparent border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link href="#" className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground">Forgot Password?</Link>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-foreground text-background py-5 px-8 text-[12px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent-dark transition-all duration-500"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-border-beige/40 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] uppercase tracking-widest font-bold text-accent-dark hover:text-foreground px-4 py-2 transition-colors"
            >
              {isLogin ? "Haven't joined yet? Sign Up" : "Already a member? Sign In"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
