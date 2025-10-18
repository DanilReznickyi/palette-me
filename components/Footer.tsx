import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur shadow-lg ring-1 ring-black/5">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">

        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} PaletteMe
        </p>

        <Link href="/" className="font-extrabold tracking-tight">
          <span className="text-xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            PaletteMe
          </span>
        </Link>


        <ul className="flex gap-4 text-sm text-slate-600">
          <li><Link href="/upload" className="hover:text-indigo-600">Try now</Link></li>
          <li><Link href="/cart" className="hover:text-indigo-600">Cart</Link></li>
          <li><Link href="/profile" className="hover:text-indigo-600">Profile</Link></li>
        </ul>
      </div>
    </footer>
  );
}
