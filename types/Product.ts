export interface Product {
  id: string;
  namaProduk: string;
  hargaBeliSm: number;
  hargaBeliSales: number;
  hargaJualEcer: number;
  hargaJualDus: number;
  kategori: string;
  isi: number;
  hargaBeliPcs: number;
  persenLabaEcer: number;
  labaDus: number;
}

export type ProductInput = Omit<Product, "id">;