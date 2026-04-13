"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, LayoutDashboard, Package, ShoppingCart, Users, ArrowUpRight, X, Upload, Loader2, Plus } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
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
    type: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirect=/admin");
    }
    
    if (activeTab === "orders") {
      loadOrders();
    }
    
    if (activeTab === "products") {
       fetchProducts();
    }
  }, [user, isAuthLoading, activeTab, router]);

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
      type: ""
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
      type: product.type || ""
    });
    setSelectedFiles(null);
    setIsAddingProduct(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrls = editingProduct?.images || [];
      
      // 1. Upload new images if selected
      if (selectedFiles && selectedFiles.length > 0) {
        const newUrls = await productService.uploadImages(Array.from(selectedFiles));
        imageUrls = [...imageUrls, ...newUrls];
      }
      
      if (imageUrls.length === 0) {
        alert("Please select at least one image");
        setIsSubmitting(false);
        return;
      }
      
      const payload = { ...formData, images: imageUrls };

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

  const stats = [
    { label: "Total Revenue", value: "₹24,50,000", change: "+12.5%", color: "text-green-500" },
    { label: "Active Orders", value: "142", icon: ShoppingCart },
    { label: "Total Products", value: products.length, icon: Package },
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

        {activeTab === "products" && (
          <div className="bg-white border border-border-beige overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/10 border-b border-border-beige">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Product</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Stock</th>
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
                    <td className="px-6 py-4 text-center text-sm font-sans font-bold">
                      ₹{product.selling_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button onClick={() => handleOpenEdit(product)} className="p-2 text-foreground/40 hover:text-foreground transition-colors"><Edit2 size={16} /></button>
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
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/10 border-b border-border-beige">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Order ID</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40">Customer Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Items</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-foreground/40 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-beige/40">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-accent/5 transition-colors text-sm">
                    <td className="px-6 py-4 font-mono text-[10px]">{order.id}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] uppercase tracking-widest font-black px-3 py-1 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{order.order_items?.length || 0}</td>
                    <td className="px-6 py-4 text-center font-bold">₹{order.total_amount.toLocaleString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && !isLoadingOrders && (
                  <tr><td colSpan={4} className="px-6 py-20 text-center text-foreground/40 italic">No orders recorded yet.</td></tr>
                )}
              </tbody>
            </table>
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
                    <input required type="number" value={formData.selling_price} onChange={e => setFormData({...formData, selling_price: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Old Price (₹)</label>
                    <input type="number" value={formData.original_price} onChange={e => setFormData({...formData, original_price: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Stock</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
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
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Type (Floral, Tote, etc.)</label>
                    <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#F5F5F0] border-0 p-4 text-sm focus:ring-1 ring-accent-dark outline-none" />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 mb-2 block">
                    Images {editingProduct ? "(Add more)" : "(Upload Selection)"}
                  </label>
                  <div className="relative border-2 border-dashed border-border-beige p-8 text-center hover:border-accent-dark transition-colors cursor-pointer group">
                    <input type="file" multiple onChange={e => setSelectedFiles(e.target.files)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <Upload size={24} className="mx-auto mb-2 text-foreground/20 group-hover:text-accent-dark transition-colors" />
                    <p className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 italic">
                      {selectedFiles ? `${selectedFiles.length} files selected` : "Select Art Assets (JPG/PNG)"}
                    </p>
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
      </main>
    </div>
  );
};

export default AdminPage;
