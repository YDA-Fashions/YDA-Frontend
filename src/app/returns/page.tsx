"use client";

import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { motion } from "framer-motion";

const ReturnsPolicy = () => {
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
              Returns & <span className="italic">Refunds</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-foreground/40">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-normal prose-a:text-accent-dark text-foreground/80 max-w-none space-y-8">
            <section>
              <p>
                At YDA Fashions, we stand behind the quality of our handcrafted products. Due to the delicate nature of our premium items, we follow a strict return policy to ensure authenticity and hygiene for all our customers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">1. Eligibility for Returns</h2>
              <p>
                <strong>We do not accept returns for a change of mind.</strong> Returns are strictly accepted <strong>ONLY</strong> in the case of receiving a damaged or defective item.
              </p>
              <p className="mt-2 text-red-600 font-bold">
                Return requests must be raised within 48 hours of delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">2. Mandatory Unboxing Video</h2>
              <p>
                To process a claim for a damaged item, you <strong>must record a continuous, unedited unboxing video</strong> from the moment the sealed package is opened until the damage is clearly shown. 
              </p>
              <p className="mt-2">
                This video must be sent to our customer care team at <strong>+91 7877646756</strong> via WhatsApp or email at support@ydafashions.com within the 48-hour window.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">3. Verification Process</h2>
              <p>
                All return requests are subject to verification by our support team. Once the unboxing video and images are reviewed, our team will connect with you to confirm the status of your return request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">4. Non-returnable Items</h2>
              <p>To maintain hygiene and quality standards, the following are completely ineligible for return:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Used, washed, or altered products.</li>
                <li>Products without their original packaging and tags attached.</li>
                <li>Customized or personalized items.</li>
                <li>Items exhibiting minor color or print variations. (Because our items feature traditional Sanganeri and Gujarati prints, slight color variations due to photography lighting or screen displays are natural and do not qualify as defects).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-foreground mb-4">5. Refunds</h2>
              <p>
                If your return request is approved by our support team, we will initiate a refund to your original payment method. For COD orders, our team will request your bank details to process the transfer. Please allow 5-7 business days for the amount to reflect in your account.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnsPolicy;
