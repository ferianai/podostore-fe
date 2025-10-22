import Header from "@/components/organisms/Header";
import "./globals.css";
import { ProductFilterProvider } from "@/components/context/ProductFilterContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ProductFilterProvider>
          <Header/>
          <main className="max-w-7xl mx-auto px-4 py-4">{children}</main>
        </ProductFilterProvider>
      </body>
    </html>
  );
}
