"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24 md:pt-48">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
              Terms & <span className="italic">Conditions</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-foreground/40">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-normal prose-a:text-accent-dark text-foreground/80 max-w-none space-y-8">
            <section>
              <p>
                Welcome to YDA Fashions, a brand of Avani Enterprises. By accessing or using our website (ydafashions.com), you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">1. General Conditions</h2>
              <p>
                We reserve the right to refuse service to anyone for any reason at any time. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">2. Accuracy of Products & Pricing</h2>
              <p>
                We make every effort to display as accurately as possible the colors and images of our products. However, as our items are handcrafted, minor variations in prints, colors, and textures may occur. Such variations do not qualify as defects. Prices for our products are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">3. Order Cancellations</h2>
              <p>
                Orders can only be cancelled <strong>before they are dispatched</strong>. Once your order has been shipped and tracking details have been generated, cancellation is not allowed. To request a cancellation before dispatch, please contact our support team immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">4. Cash on Delivery (COD) Policy</h2>
              <p>
                We offer Cash on Delivery (COD) as a convenience to our customers. However, <strong>repeated refusal of Cash on Delivery orders may lead to the restriction of future purchases</strong> from our store. We kindly request that you ensure your availability to receive the package when placing a COD order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">5. Intellectual Property</h2>
              <p>
                All content on this site, including text, graphics, logos, images, and software, is the property of Avani Enterprises (trading as YDA Fashions) and is protected by Indian and international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">6. Governing Law</h2>
              <p>
                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India, with jurisdiction in Jaipur, Rajasthan.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
