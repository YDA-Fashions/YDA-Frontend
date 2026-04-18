import { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ydafashions.com";

  // Static routes
  const staticRoutes = [
    "",
    "/shop",
    "/big-tote-bags",
    "/small-tote-bags",
    "/new-arrivals",
    "/cushion-covers",
    "/sanganeri-gujarati-prints",
    "/story",
    "/wishlist",
    "/cart",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
