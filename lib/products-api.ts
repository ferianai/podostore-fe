// lib/products-api.ts

import { Product } from "@/types/Product";

export async function updateProduct(id: string, product: Omit<Product, "id">) {
  const res = await fetch("/api/products", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...product }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to update product");
  }

  return res.json();
}
