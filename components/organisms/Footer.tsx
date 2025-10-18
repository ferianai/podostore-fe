export default function Footer() {
    return (
        <footer className="bg-[#1b0341] text-gray-200 text-sm mt-10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-center md:text-left">
            © {new Date().getFullYear()} xyzgrosir. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-gray-300">
            <a href="#" className="hover:text-yellow-400 transition">
                Privacy
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
                Terms
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
                Contact
            </a>
            </div>
        </div>
        </footer>
    );
}
