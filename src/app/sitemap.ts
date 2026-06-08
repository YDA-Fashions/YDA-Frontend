import { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";
import { blogService } from "@/services/blogService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ydafashions.com";

  // Static routes
  const staticRoutes = [
    "",
    "/shop",
    "/blog",
    "/big-tote-bags",
    "/small-tote-bags",
    "/new-arrivals",
    "/cushion-covers",
    "/sanganeri-gujarati-prints",
    "/story",
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

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await blogService.getPosts();
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    blogRoutes = [];
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
