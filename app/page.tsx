
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 space-y-8 text-2xl sm:text-xl font-semibold text-[#191258]">
      <div>Welcome to {" "}
        <Link href="/" className="cursor-pointer bg-[#191258] text-white px-2 py-1 rounded-md shadow-md hover:bg-[#100699] transition ">
          <span className="text-[#fbe80f] cursor-pointer">
            xyz<span className="text-[#1ac2ff]">grosir</span>
          </span>
        </Link>
      </div>
      <Button>
        <Link href="/product">Check our products here</Link>
      </Button>
    </div>
  );
}