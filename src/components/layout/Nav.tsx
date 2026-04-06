import Link from 'next/link';

const links = [
  { href: '/archive', label: 'Archive' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/mood', label: 'Mood' },
  { href: '/search', label: 'Search' },
  { href: '/settings', label: 'Settings' },
];

export function Nav() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-stone-200">
      <Link href="/" className="font-serif text-xl text-stone-800 hover:text-stone-600 transition-colors">
        My Diary
      </Link>
      <div className="flex items-center gap-6">
        {links.map(({ href, label }) => (
          <Link key={href} href={href}
            className="font-sans text-xs text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
