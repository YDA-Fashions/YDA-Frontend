import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collector's Vault | YDA Fashions",
  description:
    "Your private Collector's Vault – view authentic heritage orders, download certificates, and discover curated recommendations.",
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
