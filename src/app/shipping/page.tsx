"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24 md:pt-48">
        {/* Hero Section with Editorial Image */}
        <section className="relative h-[40vh] md:h-[50vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden mb-16 md:mb-24">
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/home-page-image/small-tote.jpg" 
              alt="YDA Shipping" 
              className="object-cover object-center w-full h-full opacity-80 dark:opacity-40"
            />
            <div className="absolute inset-0 bg-black/30 dark:bg-black/60" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight mb-4 italic">
              Shipping Policy
            </h1>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-black opacity-80">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 max-w-3xl">

          <div className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-normal prose-a:text-accent-dark text-foreground/80 max-w-none space-y-8">
            <section>
              <p>
                At YDA Fashions, we are dedicated to delivering our premium handcrafted collections to you in the safest and fastest way possible. Please review our shipping practices below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">1. Processing & Delivery Timeline</h2>
              <p>
                Because our items are carefully prepared and undergo strict quality checks, please allow <strong>5 to 8 days</strong> for your order to reach you after it has been placed.
              </p>
              <p className="mt-2">
                Once your order is dispatched from our fulfillment center in Jaipur, you will receive a tracking link via email or SMS to monitor your package's journey.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">2. Shipping Charges</h2>
              <p>
                Shipping charges, if any, will be calculated and displayed at checkout. We occasionally offer complimentary shipping for orders exceeding a certain value.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">3. Delivery Addresses</h2>
              <p>
                Please ensure that your delivery address and contact number are accurate. We currently ship across India. If a package is returned to us due to an incorrect address provided by the customer, re-shipping charges may apply.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">4. Cash on Delivery (COD)</h2>
              <p>
                For COD orders, please be available at the provided address to receive the package. Repeated refusal to accept COD orders may result in your account being restricted from placing future COD orders, as detailed in our Terms & Conditions.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
