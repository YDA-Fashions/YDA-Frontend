"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, LayoutDashboard, Package, ShoppingCart, Users, ArrowUpRight, X, Upload, Loader2, Plus, Banknote } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { couponService } from "@/services/couponService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Logo from "@/components/common/Logo";
import { seedProducts } from "@/utils/seedProducts";

const AdminPage = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", percent: 10 });
  
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  // Simple Product Form State
  const [formData, setFormData] = useState({
    name: "",
    product_code: "",
    description: "",
    selling_price: 0,
    original_price: 0,
    stock: 0,
    category: "bags",
    type: "",
    size: "small",
    isFeatured: false,
    images: [] as string[]
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Configure admin emails from environment variables or use safe defaults
  const adminEmailsStr = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "support@ydafashions.com,admin@ydafashions.com,ydafashions@gmail.com,harshitnaiwal@zohomail.in";
  const adminEmails = React.useMemo(() => {
    return adminEmailsStr.split(",").map(e => e.trim().toLowerCase());
  }, [adminEmailsStr]);

  const isAdmin = React.useMemo(() => {
    if (!user) return false;
    const email = user.email?.toLowerCase();
    return (
      adminEmails.includes(email) || 
      email?.endsWith("@ydafashions.com") ||
      user.app_metadata?.role === "admin" ||
      user.user_metadata?.role === "admin"
    );
  }, [user, adminEmails]);

  React.useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.push("/login?redirect=/admin");
      return;
    }
    
    if (!isAdmin) {
      console.warn("🔐 Access Denied: User is not authorized as admin:", user.email);
      return;
    }
    
    // Load ALL data on mount to ensure stats are real
    loadOrders();
    loadCoupons();
    fetchProducts();
  }, [user, isAuthLoading, isAdmin, router]);

  const loadCoupons = async () => {
    try {
      const data = await couponService.getAllCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await couponService.createCoupon({
        code: newCoupon.code,
        discount_percent: newCoupon.percent
      });
      setIsAddingCoupon(false);
      setNewCoupon({ code: "", percent: 10 });
      loadCoupons();
    } catch (err: any) {
      alert("Failed to create coupon: " + err.message);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Delete this Artflow Code?")) return;
    try {
      await couponService.deleteCoupon(id);
      loadCoupons();
    } catch (err: any) {
      alert("Failed to delete coupon: " + err.message);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      product_code: "",
      description: "",
      selling_price: 0,
      original_price: 0,
      stock: 0,
      category: "bags",
      type: "",
      size: "small",
      isFeatured: false,
      images: []
    });
    setSelectedFiles(null);
    setIsAddingProduct(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      product_code: product.product_code || "",
      description: product.description || "",
      selling_price: product.selling_price,
      original_price: product.original_price || 0,
      stock: product.stock,
      category: product.category as any,
      type: product.type || "",
      size: product.size || "small",
      isFeatured: product.isFeatured || false,
      images: product.images || []
    });
    setSelectedFiles(null);
    setIsAddingProduct(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let currentImages = [...(formData.images || [])];
      
      // 1. Upload new images if selected
      if (selectedFiles && selectedFiles.length > 0) {
        const newUrls = await productService.uploadImages(Array.from(selectedFiles));
        currentImages = [...currentImages, ...newUrls];
      }
      
      if (currentImages.length === 0) {
        alert("Please select at least one image");
        setIsSubmitting(false);
        return;
      }
      
      const payload = { 
        ...formData, 
        images: currentImages,
        featured: formData.isFeatured // Map UI to metadata
      };

      // 2. Create or Update
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      
      setIsAddingProduct(false);
      fetchProducts();
    } catch (err: any) {
      alert("Action failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleSync = async () => {
    if (!confirm("This will upload all static products to Supabase. Continue?")) return;
    setIsSyncing(true);
    const result = await seedProducts();
    if (result.success) {
      alert(`Successfully synced ${result.count} products!`);
      fetchProducts(); // Refresh the store
    } else {
      alert("Sync failed. Check console for details.");
    }
    setIsSyncing(false);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalCustomers = new Set(orders.map(o => o.user_id || o.customer_email || o.customer_name)).size;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "Live", color: "text-green-500" },
    { label: "Active Orders", value: orders.length.toString(), icon: ShoppingCart },
    { label: "Total Products", value: products.length.toString(), icon: Package },
    { label: "Customers", value: totalCustomers.toString(), icon: Users },
  ];

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center font-serif text-xl italic opacity-40 animate-pulse">
        Verifying security access...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md w-full space-y-8 bg-white border border-border-beige p-8 shadow-sm">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-600 block">Security Alert</span>
            <h1 className="text-3xl font-serif tracking-tight text-black italic">
              Access Denied
            </h1>
            <div className="w-12 h-[1px] bg-black/10 mx-auto my-6" />
            <p className="text-sm font-sans text-foreground/60 leading-relaxed">
              This terminal is reserved for YDA Fashions team members only. Your account ({user.email}) does not possess administrative privileges.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => router.push("/")}
              className="w-full bg-foreground text-background py-4 text-[10px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-accent-dark transition-all duration-300"
            >
              Return to Curation
            </button>
            <button 
              onClick={async () => {
                const { useAuthStore } = await import("@/store/useAuthStore");
                await useAuthStore.getState().signOut();
                router.push("/login?redirect=/admin");
              }}
              className="w-full border border-foreground/10 py-4 text-[10px] uppercase tracking-[0.3em] font-sans font-bold hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Sign in with another account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col lg:flex-row">
      {/* Sidebar - Responsive */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-border-beige p-4 lg:p-8 flex-shrink-0 z-20 flex lg:flex-col lg:space-y-12">
        <div className="hidden lg:block">
          <Logo variant="horizontal" theme="dark" />
        </div>
        
        <nav className="flex lg:flex-col gap-2 w-full overflow-x-auto lg:overflow-visible">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-colors whitespace-nowrap ${
              activeTab === "dashboard" ? "bg-foreground text-background" : "text-foreground/40 hover:bg-accent/10"
            }`}
          >
            <LayoutDashboard size={18} /> <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-colors whitespace-nowrap ${
              activeTab === "products" ? "bg-foreground text-background" : "text-foreground/40 hover:bg-accent/10"
            }`}
          >
            <Package size={18} /> <span className="hidden sm:inline">Products</span>
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-colors whitespace-nowrap ${
              activeTab === "orders" ? "bg-foreground text-background" : "text-foreground/40 hover:bg-accent/10"
            }`}
          >
            <ShoppingCart size={18} /> <span className="hidden sm:inline">Orders</span>
          </button>
          <button 
            onClick={() => setActiveTab("coupons")}
            className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 text-[10px] tracking-widest font-bold uppercase transition-colors whitespace-nowrap ${
              activeTab === "coupons" ? "bg-foreground text-background" : "text-foreground/40 hover:bg-accent/10"
            }`}
          >
            <Banknote size={18} /> <span className="hidden sm:inline">Coupons</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="bg-red-600 text-white text-center py-2 text-[10px] font-black uppercase tracking-[0.5em] mb-8 rounded-sm">
          🚀 Admin Panel V2 - Latest Options Enabled (Size & Featured)
        </div>
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-serif tracking-tight uppercase">Studio Control</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] uppercase tracking-widest font-black text-green-700">Database Live - V2</span>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-foreground/40">
              {activeTab} Management
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="border border-border-beige text-foreground/60 px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-accent/5 transition-colors flex items-center gap-3 disabled:opacity-50"
            >
              {isSyncing ? "Syncing..." : "Sync Static Data"}
            </button>
            <button 
              onClick={handleOpenAdd}
              className="bg-accent-dark text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-foreground transition-colors flex items-center gap-3"
            >
              <Plus size={16} /> New Entry
            </button>
          </div>
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

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white border border-border-beige p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest">Recent Activity</h3>
                <button onClick={() => setActiveTab("orders")} className="text-[10px] uppercase font-bold text-accent-dark hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center py-3 border-b border-border-beige last:border-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-foreground/40">{order.id}</span>
                      <span className="text-sm font-bold">{order.customer_name || "Unknown Guest"}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">₹{order.total_amount.toLocaleString()}</div>
                      <div className="text-[9px] uppercase tracking-tighter text-foreground/40">{new Date(order.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center py-8 text-foreground/40 italic">No recent transactions recorded.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white border border-border-beige overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/10 border-b border-border-beige">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Product</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Stock</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Size</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Price</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-beige/40">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="relative w-12 h-16 bg-[#F5F5F0]">
                        <Image src={product.images?.[0] || product.colors?.[0]?.images?.[0] || "/images/placeholder.jpg"} alt={product.name} fill className="object-contain" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold font-sans">{product.name}</h4>
                        <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{product.product_code}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-sans">
                      {product.stock_quantity ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                      {product.size || "—"}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-sans font-bold">
                      ₹{product.selling_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button 
                          onClick={() => handleOpenEdit(product)} 
                          className="flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-accent-dark transition-all"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-foreground/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white border border-border-beige overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-accent/10 border-b border-border-beige">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Reference & Date</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Customer Details</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Ordered Masterpieces</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-right">Total Amount</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-beige/40">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-accent/5 transition-colors text-xs align-top">
                      <td className="px-6 py-6">
                        <p className="font-mono text-[10px] text-black mb-1">#{order.id.slice(0, 12).toUpperCase()}</p>
                        <p className="text-[10px] text-foreground/40">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          <br />
                          {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="font-bold text-black uppercase mb-1">{order.customer_name || 'Anonymous'}</p>
                        <p className="text-[10px] text-foreground/60 mb-2">{order.customer_phone ? `+91 ${order.customer_phone}` : 'No Phone'}</p>
                        <div className="max-w-[200px] p-2 bg-[#F5F5F0] rounded-sm text-[9px] text-foreground/60 leading-relaxed italic border border-black/5">
                          {order.shipping_address}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-3">
                          {order.order_items?.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 group">
                              <div className="relative w-10 h-10 bg-white border border-black/5 rounded-sm overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.products?.images?.[0] || "/images/placeholder.jpg"} 
                                  alt={item.products?.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-black uppercase truncate">{item.products?.name}</p>
                                <p className="text-[9px] text-foreground/40 font-mono">QTY: {item.quantity} × ₹{item.price_at_purchase?.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right font-black text-emerald-800">
                        ₹{order.total_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <select 
                          value={order.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            // Optimistic Update for UI snappiness
                            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                            try {
                              await orderService.updateOrderStatus(order.id, newStatus);
                              // Silence fetch to avoid flicker if DB is fast
                            } catch (err) {
                              alert("Failed to update status");
                              loadOrders(); // Revert on failure
                            }
                          }}
                          className={`text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-sm shadow-sm border-0 cursor-pointer appearance-none text-center ${
                            order.status === 'paid' ? 'bg-green-600 text-white' : 
                            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-orange-500 text-white'
                          }`}
                        >
                          <option value="pending" className="bg-white text-black">Pending</option>
                          <option value="paid" className="bg-white text-black">Paid</option>
                          <option value="delivered" className="bg-white text-black">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && !isLoadingOrders && (
                    <tr><td colSpan={5} className="px-6 py-24 text-center text-foreground/40 italic uppercase tracking-[0.2em] text-[10px]">No orders recorded in the archives yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Simple Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl border border-border-beige shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-border-beige flex justify-between items-center bg-accent/5">
                <h2 className="text-xl font-serif uppercase tracking-tight italic">
                  {editingProduct ? "Refine Masterpiece" : "Curate New Entry"}
                </h2>
                <button onClick={() => setIsAddingProduct(false)} className="p-2 hover:bg-black/5 transition-colors"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Product Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Product Code</label>
                    <input type="text" placeholder="e.g. YDA-TB-001" value={formData.product_code} onChange={e => setFormData({...formData, product_code: e.target.value})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Price (₹)</label>
                    <input required type="number" value={formData.selling_price || ""} onChange={e => setFormData({...formData, selling_price: parseFloat(e.target.value) || 0})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Old Price (₹)</label>
                    <input type="number" value={formData.original_price || ""} onChange={e => setFormData({...formData, original_price: parseFloat(e.target.value) || 0})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Stock</label>
                    <input required type="number" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none appearance-none">
                      <option value="bags">Bags</option>
                      <option value="cushions">Cushions</option>
                    </select>
                  </div>
                  {formData.category === "bags" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Size (for Totes)</label>
                      <select value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none appearance-none">
                        <option value="small">Small</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Featured Piece?</label>
                    <div className="flex-1 flex items-center bg-[#F5F5F0] px-4">
                      <input 
                        type="checkbox" 
                        checked={formData.isFeatured} 
                        onChange={e => setFormData({...formData, isFeatured: e.target.checked})} 
                        className="w-4 h-4 text-accent-dark focus:ring-0 border-0 rounded-none" 
                      />
                      <span className="ml-3 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Show on Homepage</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Type (Floral, Tote, etc.)</label>
                  <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black text-foreground/40 mb-4 block">
                    Product Masterpieces (Images)
                  </label>
                  
                  {/* Current Images Manager */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mb-8">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-[#F5F5F0] border border-black/5 rounded-sm group overflow-hidden">
                          <img src={img} alt="Product" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => {
                              const newImgs = [...formData.images];
                              newImgs.splice(idx, 1);
                              setFormData({...formData, images: newImgs});
                            }}
                            className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative border-2 border-dashed border-border-beige p-10 text-center hover:border-accent-dark transition-all cursor-pointer group bg-accent/5">
                    <input type="file" multiple onChange={e => setSelectedFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload size={32} className="mx-auto mb-4 text-foreground/20 group-hover:text-accent-dark transition-all" />
                    <p className="text-[10px] uppercase tracking-widest font-black text-foreground/40 italic">
                      {selectedFiles ? `${selectedFiles.length} new files ready` : "Drag & Drop New Art Assets"}
                    </p>
                    <p className="text-[8px] text-foreground/20 mt-2 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-border-beige">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-accent-dark text-white px-12 py-5 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-foreground transition-all flex items-center gap-4 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Performing Artistry...
                      </>
                    ) : (editingProduct ? "Update Masterpiece" : "Commit to Collection")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "coupons" && (
          <div className="space-y-8">
            <div className="bg-white border border-border-beige p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Create New Artflow Code</h3>
              <form onSubmit={handleAddCoupon} className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Code</label>
                  <input required type="text" placeholder="e.g. FESTIVE50" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                </div>
                <div className="w-32">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Discount %</label>
                  <input required type="number" value={newCoupon.percent} onChange={e => setNewCoupon({...newCoupon, percent: parseInt(e.target.value)})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                </div>
                <button type="submit" className="bg-foreground text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-accent-dark transition-colors">Generate Code</button>
              </form>
            </div>

            <div className="bg-white border border-border-beige overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-accent/10 border-b border-border-beige">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Active Code</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Value</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-beige/40">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-6 py-4 font-bold tracking-widest">{coupon.code}</td>
                      <td className="px-6 py-4 text-center font-sans">{coupon.discount_percent}% OFF</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 text-foreground/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-foreground/40 italic">No active coupons. Create one above.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
