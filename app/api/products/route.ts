import { NextResponse } from "next/server";

// === Type Definitions ===
type AirtableFields = {
  Nama_Produk?: string;
  Harga_Beli_Sales?: number;
  Harga_Beli_SM?: number;
  Harga_Jual_Ecer?: number;
  Harga_Jual_Dus?: number;
  Kategori?: string;
  Isi?: number;
  Persen_Laba_Ecer?: number;
  Laba_Dus?: number;
  Harga_Beli_Pcs?: number;
};

type AirtableRecord = {
  id: string;
  fields: AirtableFields;
};

type ProductRecord = {
  id: string;
  namaProduk: string;
  hargaBeliSm: number;
  hargaBeliSales: number;
  hargaJualEcer: number;
  hargaJualDus: number;
  kategori: string;
  isi: number;
  persenLabaEcer: number;
  labaDus: number;
  hargaBeliPcs: number;
};

// === Airtable Setup ===
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME_PRODUCT!;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  "Content-Type": "application/json",
};

// === Fungsi bantu hitung total record (loop semua halaman Airtable) ===
async function getAllRecordsCount(filterFormula?: string): Promise<number> {
  let count = 0;
  let offset = "";

  do {
    const url = new URL(BASE_URL);
    if (filterFormula) url.searchParams.set("filterByFormula", filterFormula);
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), { headers, cache: "no-store" });
    if (!res.ok) break;
    const data = await res.json();
    count += data.records?.length || 0;
    offset = data.offset || "";
  } while (offset);

  return count;
}

// === FUNCTION: GET Unique Categories from Database (All) ===
async function getAllCategories(): Promise<string[]> {
  const categories: string[] = [];
  let offset = "";

  do {
    const url = new URL(BASE_URL);
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), { headers, cache: "no-store" });
    if (!res.ok) break;

    const data = await res.json();
    data.records.forEach((record: AirtableRecord) => {
      const kategori = record.fields.Kategori;
      if (kategori && !categories.includes(kategori)) {
        categories.push(kategori);
      }
    });

    offset = data.offset || "";
  } while (offset);

  return categories.sort((a, b) => a.localeCompare(b));
}

// === GET Handler ===
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageSize = Number(searchParams.get("pageSize")) || 100;
  const offset = searchParams.get("offset") || "";
  const search = searchParams.get("search") || "";
  const kategori = searchParams.get("kategori") || "";
  const exportData = searchParams.get("export") === "true";
  const mode = searchParams.get("mode");
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // ✅ Jika mode category → return daftar kategori
  if (mode === "category") {
    const categories = await getAllCategories();
    return NextResponse.json({ categories });
  }

  // === Filter Airtable ===
  let filterFormula = "";
  if (search) {
    const safeSearch = search.replace(/"/g, '\\"'); // Hindari error kutip
    filterFormula = `OR(FIND(LOWER("${safeSearch}"), LOWER({Nama_Produk})))`;
  }
  if (kategori) {
    const kategoriFilter = `{Kategori}="${kategori}"`;
    filterFormula = filterFormula
      ? `AND(${filterFormula}, ${kategoriFilter})`
      : kategoriFilter;
  }

  // === Build Query Params ===
  const queryParams = new URLSearchParams();
  if (pageSize && !exportData) queryParams.set("pageSize", String(pageSize));
  if (offset && !exportData) queryParams.set("offset", offset);
  if (filterFormula) queryParams.set("filterByFormula", filterFormula);

  const res = await fetch(`${BASE_URL}?${queryParams.toString()}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Airtable error:", text);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }

  const data = await res.json();

  // === Format Data ===
  const mappedRecords: ProductRecord[] = (data.records as AirtableRecord[]).map((r) => {
    const isi = Number(r.fields.Isi) || 0;
    const hargaBeliSm = Number(r.fields.Harga_Beli_SM) || 0;
    const hargaBeliPcs =
      isi > 0 ? parseFloat((hargaBeliSm / isi).toFixed(2)) : 0;

    return {
      id: r.id,
      namaProduk: r.fields.Nama_Produk || "",
      hargaBeliSales: Number(r.fields.Harga_Beli_Sales) || 0,
      hargaBeliSm,
      hargaJualEcer: Number(r.fields.Harga_Jual_Ecer) || 0,
      hargaJualDus: Number(r.fields.Harga_Jual_Dus) || 0,
      kategori: r.fields.Kategori || "",
      isi,
      persenLabaEcer: Number(r.fields.Persen_Laba_Ecer) || 0,
      labaDus: Number(r.fields.Laba_Dus) || 0,
      hargaBeliPcs,
    };
  });

  // === Export CSV ===
  if (exportData) {
    const csvHeaders =
      "ID,Nama Produk,Harga Beli SM,Harga Beli Sales,Harga Jual Ecer,Harga Jual Dus,Kategori,Isi,Harga Beli Pcs,Persen Laba Ecer,Laba Dus\n";
    const csvRows = mappedRecords
      .map(
        (r) =>
          `${r.id},"${r.namaProduk}",${r.hargaBeliSm},${r.hargaBeliSales},${r.hargaJualEcer},${r.hargaJualDus},"${r.kategori}",${r.isi},${r.hargaBeliPcs},${r.persenLabaEcer},${r.labaDus}`
      )
      .join("\n");
    const csv = csvHeaders + csvRows;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=products.csv",
      },
    });
  }

  // === Sort Products by namaProduk A-Z or Z-A ===
  mappedRecords.sort((a, b) =>
    sortOrder === "asc"
      ? a.namaProduk.localeCompare(b.namaProduk)
      : b.namaProduk.localeCompare(a.namaProduk)
  );

  const totalCount = await getAllRecordsCount(filterFormula);

  return NextResponse.json({
    records: mappedRecords,
    offset: data.offset || null,
    totalCount,
  });
}

// === POST ===
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
            Laba_Dus: Number(product.labaDus),
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

// === PATCH ===
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
            Laba_Dus: Number(product.labaDus),
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

// === DELETE ===
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