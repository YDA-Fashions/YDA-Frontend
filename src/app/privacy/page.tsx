"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
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
              Privacy <span className="italic">Policy</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-foreground/40">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-normal prose-a:text-accent-dark text-foreground/80 max-w-none space-y-8">
            <section>
              <p>
                YDA Fashions ("we," "our," or "us"), a brand of Avani Enterprises, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website (ydafashions.com) or make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">1. Information We Collect</h2>
              <p>We collect information to provide better services to our customers. The types of information we collect include:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Personal Information:</strong> Name, shipping address, billing address, email address, and phone number when you register or place an order.</li>
                <li><strong>Payment Information:</strong> Processed securely via trusted third-party gateways (e.g., Razorpay). We do not store your full credit card or bank details on our servers.</li>
                <li><strong>Device & Browsing Information:</strong> IP address, browser type, device type, and interaction data via cookies and analytics tools.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process and fulfill your orders, including sending shipping updates.</li>
                <li>To communicate with you regarding your purchases, inquiries, and customer support.</li>
                <li>For marketing communication (you can opt-out at any time).</li>
                <li>To improve our website functionality, prevent fraud, and optimize our store using analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">3. Third-Party Services</h2>
              <p>
                We may share your information with trusted third parties to help us provide our services, including:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Payment Processors:</strong> Razorpay for secure checkout processing.</li>
                <li><strong>Shipping Partners:</strong> Logistics providers (e.g., Shiprocket) to deliver your orders.</li>
                <li><strong>Analytics & Marketing:</strong> Google Analytics and Meta Pixel to understand user behavior and serve relevant advertisements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">4. Cookies</h2>
              <p>
                We use cookies to enhance your browsing experience, remember your cart items, and analyze site traffic. By using our website, you consent to our use of cookies. You can manage your cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">5. Contact Us</h2>
              <p>If you have any questions or concerns about our Privacy Policy, please contact us at:</p>
              <p className="mt-2">
                <strong>Email:</strong> support@ydafashions.com<br />
                <strong>Customer Care:</strong> +91 7877646756
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
