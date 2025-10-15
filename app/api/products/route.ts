// app/api/products/route.ts
import { NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME!;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  "Content-Type": "application/json",
};

// GET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const offset = searchParams.get("offset") || "";
  const search = searchParams.get("search") || "";

  // Optional filtering by Nama_Produk
  const filterFormula = search
    ? `FIND(LOWER("${search}"), LOWER({Nama_Produk}))`
    : "";

  const queryParams = new URLSearchParams({
    ...(pageSize ? { pageSize: String(pageSize) } : {}),
    ...(offset ? { offset } : {}),
    ...(filterFormula ? { filterByFormula: filterFormula } : {}),
  });

  const res = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Airtable error:", text);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  const data = await res.json();

  const mappedRecords = data.records.map(
    (r: { id: string; fields: Record<string, string | number | null | undefined> }) => ({
      id: r.id,
      namaProduk: r.fields.Nama_Produk || "",
      hargaBeliSales: Number(r.fields.Harga_Beli_Sales) || 0,
      hargaBeliSm: Number(r.fields.Harga_Beli_SM) || 0,
      hargaJualEcer: Number(r.fields.Harga_Jual_Ecer) || 0,
      hargaJualDus: Number(r.fields.Harga_Jual_Dus) || 0,
      kategori: r.fields.Kategori || "",
      isi: Number(r.fields.Isi) || 0,
      persenLabaEcer: Number(r.fields.Persen_Laba_Ecer) || 0,
      persenLabaDus: Number(r.fields.Persen_Laba_Dus) || 0,
    })
  );

  return NextResponse.json({
    records: mappedRecords,
    offset: data.offset || null,
  });
}

// POST
export async function POST(request: Request) {
  try {
    const product = await request.json();

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
      return NextResponse.json({ error: "Failed to add product" }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json(result.records[0]);
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// PATCH (UPDATE)
export async function PATCH(request: Request) {
  try {
    const { id, ...product } = await request.json();

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
      return NextResponse.json({ error: "Failed to update product" }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json(result.records[0]);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}?records[]=${id}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error response:", text);
      return NextResponse.json({ error: "Failed to delete product" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
