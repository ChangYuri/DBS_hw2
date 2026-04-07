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
    <nav className="flex items-center justify-between px-8 py-4 border-b border-stone-100">
      <Link href="/" className="hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-lora), Georgia, serif', fontStyle: 'italic', fontSize: '1.4rem', color: '#C96A50' }}>
        my diary
      </Link>
      <div className="flex items-center gap-6">
        {links.map(({ href, label }) => (
          <Link key={href} href={href}
            className="font-sans text-xs text-stone-400 hover:text-stone-700 transition-colors tracking-wide">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
