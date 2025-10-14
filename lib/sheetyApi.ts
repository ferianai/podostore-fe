/* eslint-disable @typescript-eslint/no-explicit-any */
export const BASE_URL =
  "https://api.sheety.co/742e59332b31ffb1270b74365224570d/podostore";

const headers = { "Content-Type": "application/json" };

// 🔹 GET
export async function getProductList() {
  const res = await fetch(`${BASE_URL}/products?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
}

// 🔹 POST
export async function addProduct(product: any) {
  console.log("addProduct called with product:", product);
  const payload = {
    product: {
      namaProduk: product.namaProduk,
      hargaJualEcer: product.hargaJualEcer,
      hargaJualGrosir: product.hargaJualGrosir,
      hargaBeliSm: product.hargaBeliSm,
      hargaBeliSales: product.hargaBeliSales,
      category: product.category,
      qty: product.qty,
      status: product.status,
    },
  };
  console.log("addProduct payload:", JSON.stringify(payload, null, 2));
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error response:", text);
    throw new Error("Failed to add product");
  }

  const result = await res.json();
  console.log("addProduct result:", result);
  return result;
}

// 🔹 PUT
export async function updateProduct(id: number, product: any) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      product: {
        namaProduk: product.namaProduk,
        hargaJualEcer: product.hargaJualEcer,
        hargaJualGrosir: product.hargaJualGrosir,
        hargaBeliSm: product.hargaBeliSm,
        hargaBeliSales: product.hargaBeliSales,
        category: product.category,
        qty: product.qty,
        status: product.status,
      },
    }),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return await res.json();
}

// 🔹 DELETE
export async function deleteProduct(id: number) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return true;
}
