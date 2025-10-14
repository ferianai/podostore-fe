import Link from "next/link";

export default function ProductPage() {
    return (
        <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Product List</h2>
        <Link
            href="/product/editor"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
            Edit di OnlyOffice
        </Link>
        </div>
    );
}
