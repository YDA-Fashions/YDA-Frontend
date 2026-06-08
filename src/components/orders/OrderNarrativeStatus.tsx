"use client";

import React from "react";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";

interface NarrativeConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const NARRATIVES: Record<string, NarrativeConfig> = {
  paid: {
    title: "Curating in Jaipur",
    description: "Your masterpiece is being prepared.",
    icon: <CheckCircle size={14} className="text-emerald-500" aria-hidden />,
  },
  shipped: {
    title: "Artisan Care",
    description: "Hand-packed and on its way.",
    icon: <Truck size={14} className="text-blue-500" aria-hidden />,
  },
  delivered: {
    title: "Delivered",
    description: "Now part of your private collection.",
    icon: <Package size={14} className="text-emerald-600" aria-hidden />,
  },
};

const DEFAULT_NARRATIVE: NarrativeConfig = {
  title: "Pending",
  description: "Awaiting confirmation.",
  icon: <Clock size={14} className="text-amber-500" aria-hidden />,
};

interface OrderNarrativeStatusProps {
  status: string;
  className?: string;
}

export default function OrderNarrativeStatus({ status, className = "" }: OrderNarrativeStatusProps) {
  const key = status?.toLowerCase() ?? "";
  const narrative = NARRATIVES[key] ?? DEFAULT_NARRATIVE;

  return (
    <div className={className} role="status" aria-live="polite">
      <div className="flex items-center gap-2">
        {narrative.icon}
        <p className="text-sm font-sans font-bold uppercase tracking-widest text-black">
          {narrative.title}
        </p>
      </div>
      <p className="text-xs font-sans text-black/70 mt-1 leading-relaxed">
        {narrative.description}
      </p>
    </div>
  );
}
