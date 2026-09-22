import type { Metadata } from 'next';

import './globals.css';

import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '余白手记 · 个人博客演示',
    template: '%s · 余白手记',
  },
  description: '记录产品、技术与日常观察的个人博客交互演示。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
