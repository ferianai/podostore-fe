// lib/airtableApi.ts
// Airtable API interaction functions
// Reference: https://airtable.com/api

const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY!;
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!;
const TABLE_NAME = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME!;

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  "Content-Type": "application/json",
};

// --- GET PRODUCT LIST ---
export async function getProductList(options: {
  offset?: string;
  pageSize?: number;
  filterByFormula?: string;
  sort?: { field: string; direction: "asc" | "desc" }[];
} = {}) {
  const params = new URLSearchParams();
  if (options.pageSize) params.append("pageSize", options.pageSize.toString());
  if (options.offset) params.append("offset", options.offset);
  if (options.filterByFormula)
    params.append("filterByFormula", options.filterByFormula);
  if (options.sort && options.sort.length > 0) {
    options.sort.forEach((s, index) => {
      params.append(`sort[${index}][field]`, s.field);
      params.append(`sort[${index}][direction]`, s.direction);
    });
  }

  const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
  const res = await fetch(url, { headers, cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();

  // Map Airtable fields → app fields
  const mapped = data.records.map(
    (r: { id: string; fields: Record<string, string | number | null | undefined> }) => ({
      id: r.id,
      namaProduk: r.fields.Nama_Produk || "",
      hargaBeliSales: r.fields.Harga_Beli_Sales || 0,
      hargaBeliSm: r.fields.Harga_Beli_SM || 0,
      hargaJualEcer: r.fields.Harga_Jual_Ecer || 0,
      hargaJualDus: r.fields.Harga_Jual_Dus || 0,
      kategori: r.fields.Kategori || "",
      isi: r.fields.Isi || 0,
      persenLabaEcer: r.fields.Persen_Laba_Ecer || 0,
      persenLabaDus: r.fields.Persen_Laba_Dus || 0,
    })
  );

  return { records: mapped, offset: data.offset };
}

// --- ADD PRODUCT ---
export async function addProduct(product: {
  namaProduk: string;
  hargaBeliSm: number;
  hargaBeliSales: number;
  hargaJualEcer: number;
  hargaJualDus: number;
  kategori: string;
  isi: number;
  persenLabaEcer: number;
  persenLabaDus: number;
}) {
  const payload = {
    records: [
      {
        fields: {
          Nama_Produk: product.namaProduk,
          Harga_Beli_SM: product.hargaBeliSm,
          Harga_Beli_Sales: product.hargaBeliSales,
          Harga_Jual_Ecer: product.hargaJualEcer,
          Harga_Jual_Dus: product.hargaJualDus,
          Kategori: product.kategori,
          Isi: product.isi,
          Persen_Laba_Ecer: Number(product.persenLabaEcer),
          Persen_Laba_Dus: Number(product.persenLabaDus),
        },
      },
    ],
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error response:", text);
    throw new Error("Failed to add product");
  }

  const result = await res.json();
  return result.records[0];
}

// --- UPDATE PRODUCT ---
export async function updateProduct(
  id: string,
  product: {
    namaProduk: string;
    hargaBeliSm: number;
    hargaBeliSales: number;
    hargaJualEcer: number;
    hargaJualDus: number;
    kategori: string;
    isi: number;
    persenLabaEcer: number;
    persenLabaDus: number;
  }
) {
  const payload = {
    records: [
      {
        id,
        fields: {
          Nama_Produk: product.namaProduk,
          Harga_Beli_SM: product.hargaBeliSm,
          Harga_Beli_Sales: product.hargaBeliSales,
          Harga_Jual_Ecer: product.hargaJualEcer,
          Harga_Jual_Dus: product.hargaJualDus,
          Kategori: product.kategori,
          Isi: product.isi,
          Persen_Laba_Ecer: Number(product.persenLabaEcer),
          Persen_Laba_Dus: Number(product.persenLabaDus),
        },
      },
    ],
  };

  const res = await fetch(BASE_URL, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error response:", text);
    throw new Error("Failed to update product");
  }

  const result = await res.json();
  return result.records[0];
}

// --- DELETE PRODUCT ---
export async function deleteProduct(id: string) {
  const res = await fetch(`${BASE_URL}?records[]=${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Error response:", text);
    throw new Error("Failed to delete product");
  }

  return true;
}
