import { NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME_CATEGORY!;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

const headers = {
  Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
};

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

export async function GET() {
  try {
    const res = await fetch(BASE_URL, { headers });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Airtable request failed with status ${res.status}` },
        { status: res.status }
      );
    }

    const data: { records: AirtableRecord[] } = await res.json();

    const categories = data.records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    return NextResponse.json({ records: categories });
  } catch (err: unknown) {
    // Tangani error dengan aman tanpa ESLint warning
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch categories: ${message}` },
      { status: 500 }
    );
  }
}
