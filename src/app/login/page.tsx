"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccountModalOpen = useUIStore((state) => state.setAccountModalOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        setAuth(data.user, data.session);
        router.push("/");
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (signUpError) throw signUpError;
        setAuth(data.user, data.session);
        setAccountModalOpen(true);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-transparent border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors"
                />
              </div>
            )}
            
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Email Address</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors"
              />
            </div>
            
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/60 mb-2 block">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-border-beige p-4 text-sm focus:outline-none focus:border-accent-dark transition-colors"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link href="#" className="text-[10px] uppercase tracking-widest text-foreground/40 hover:text-foreground">Forgot Password?</Link>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 text-[10px] p-4 uppercase tracking-widest font-bold text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-5 px-8 text-[12px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent-dark transition-all duration-500 disabled:opacity-50"
            >
              {isLoading ? "Synchronizing..." : (isLogin ? "Sign In" : "Create Account")}
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
