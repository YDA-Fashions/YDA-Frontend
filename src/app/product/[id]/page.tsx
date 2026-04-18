import React from "react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, Product } from "@/data/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import JsonLd from "@/components/common/JsonLd";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * generateMetadata
 * 
 * Dynamically generates SEO metadata for each product.
 */
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  const product = PRODUCTS.find((p) => p.id === id || p.product_code === id);

  if (!product) {
    return {
      title: "Product Not Found | YDA",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} | YDA Premium Handcrafted`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://ydafashions.com/product/${product.id}`,
      type: "article",
      images: [
        product.colors[0].images[0],
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.substring(0, 160),
      images: [product.colors[0].images[0]],
    },
    alternates: {
      canonical: `https://ydafashions.com/product/${product.id}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const id = (await params).id;
  const product = PRODUCTS.find((p) => p.id === id || p.product_code === id);

  if (!product) {
    notFound();
  }

  // Get related products (same logic as before but on server)
  const sameCategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 8);
  const otherCategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category !== product.category
  ).slice(0, 7);
  const relatedProducts = [...sameCategory, ...otherCategory];

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ydafashions.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category === "bags" ? "Bags" : "Cushions",
        "item": `https://ydafashions.com/${product.category === "bags" ? "small-tote-bags" : "cushion-covers"}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://ydafashions.com/product/${product.id}`
      }
    ]
  };

  // Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.colors[0].images,
    "description": product.description,
    "sku": product.id,
    "mpn": product.product_code || product.id,
    "brand": {
      "@type": "Brand",
      "name": "YDA"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://ydafashions.com/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.selling_price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": 0,
          "currency": "INR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 5,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "24"
    }
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts} 
      />
    </>
  );
}

/**
 * generateStaticParams
 * 
 * Allows Next.js to statically generate these pages at build time.
 */
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}
