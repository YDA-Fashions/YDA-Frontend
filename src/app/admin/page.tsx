"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, LayoutDashboard, Package, ShoppingCart, Users, ArrowUpRight } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import Logo from "@/components/common/Logo";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);

  const stats = [
    { label: "Total Revenue", value: "₹24,50,000", change: "+12.5%", color: "text-green-500" },
    { label: "Active Orders", value: "142", icon: ShoppingCart },
    { label: "Total Products", value: productList.length, icon: Package },
    { label: "Customers", value: "1,200", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border-beige p-6 space-y-12 hidden lg:flex flex-col">
        <Logo variant="horizontal" theme="dark" />
        
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-colors ${
              activeTab === "dashboard" ? "bg-foreground text-background" : "text-foreground/40 hover:bg-accent/10"
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-colors ${
              activeTab === "products" ? "bg-foreground text-background" : "text-foreground/40 hover:bg-accent/10"
            }`}
          >
            <Package size={18} /> Products
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-4 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-colors ${
              activeTab === "orders" ? "bg-foreground text-background" : "text-foreground/40 hover:bg-accent/10"
            }`}
          >
            <ShoppingCart size={18} /> Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif tracking-tight mb-2 uppercase">Studio Control</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-foreground/40">
              {activeTab} Management
            </p>
          </div>
          
          <button className="bg-accent-dark text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground transition-colors flex items-center gap-3">
            <Plus size={16} /> New Entry
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 border border-border-beige flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">{stat.label}</span>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-serif">{stat.value}</span>
                {stat.change && <span className={`text-[10px] font-sans font-bold ${stat.color}`}>{stat.change}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Product Table */}
        <div className="bg-white border border-border-beige overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-accent/10 border-b border-border-beige">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Price</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-beige/40">
              {productList.map((product) => (
                <tr key={product.id} className="hover:bg-accent/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="relative w-12 h-16 bg-[#F5F5F0]">
                      <Image src={product.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} alt={product.name} fill className="object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-sans">{product.name}</h4>
                      <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{product.type} Print</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-accent/20 rounded-full text-accent-dark">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-sans font-bold">
                    ₹{product.selling_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button className="p-2 text-foreground/40 hover:text-foreground transition-colors"><Edit2 size={16} /></button>
                      <button className="p-2 text-foreground/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      <button className="p-2 text-foreground/40 hover:text-accent-dark transition-colors"><ArrowUpRight size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
