// lib/productCalculations.ts

export function calculateHargaBeliPcs(hargaBeliSm: number, isi: number): number {
  if (!isi || isi <= 0) return 0;
  return parseFloat((hargaBeliSm / isi).toFixed(2));
}
