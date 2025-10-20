// components/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <Link href="/"><a className="text-xl font-bold">Bleskit Cuts</a></Link>
        <nav className="space-x-4">
          <Link href="/"><a>Home</a></Link>
          <Link href="/booking"><a>Book</a></Link>
          <Link href="/admin/login"><a className="text-sm px-3 py-1 border rounded">Admin</a></Link>
        </nav>
      </div>
    </header>
  );
}
