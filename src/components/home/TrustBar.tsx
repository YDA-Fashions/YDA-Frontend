import React from "react";
import { Truck, ShieldCheck, RefreshCcw } from "lucide-react";

export const TrustBar = () => {
  const items = [
    {
      icon: <Truck className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Free Shipping",
      description: "On orders over ₹5000",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Secure Checkout",
      description: "100% encrypted payments",
    },
    {
      icon: <RefreshCcw className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Easy Returns",
      description: "7-day return policy",
    },
  ];

  return (
    <div className="w-full bg-[#f8f8f8] py-8 md:py-12 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs space-y-3">
              <div className="p-4 bg-white rounded-full shadow-sm text-black">
                {item.icon}
              </div>
              <h3 className="text-sm md:text-base font-black uppercase tracking-widest text-gray-900">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
