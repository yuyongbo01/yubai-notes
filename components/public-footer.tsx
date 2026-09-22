import Link from 'next/link';

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-ink text-white">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-5 py-9 text-sm md:flex-row md:items-center md:justify-between md:px-8">
        <p className="text-white/62">© 2026 余白手记 · 演示内容</p>
        <div className="flex gap-5 text-white/72">
          <Link href="/about" className="hover:text-white">关于</Link>
          <Link href="/posts" className="hover:text-white">归档</Link>
          <a href="/rss.xml" className="hover:text-white">RSS</a>
        </div>
      </div>
    </footer>
  );
}
