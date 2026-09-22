'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ExternalLink, FileText, Image, LayoutDashboard, LogOut, PenLine, Settings2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const nav = [
  { href: '/studio', label: '工作台', icon: LayoutDashboard },
  { href: '/studio/posts', label: '文章', icon: FileText },
  { href: '/studio/posts/new', label: '写新文章', icon: PenLine },
  { href: '/studio/media', label: '媒体', icon: Image },
  { href: '/studio/analytics', label: '数据', icon: BarChart3 },
  { href: '/studio/settings', label: '设置', icon: Settings2 },
];

const titles: Record<string, string> = {
  '/studio': '工作台',
  '/studio/posts': '文章管理',
  '/studio/posts/new': '写新文章',
  '/studio/media': '媒体库',
  '/studio/analytics': '数据概览',
  '/studio/settings': '站点设置',
};

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/studio/login') return <>{children}</>;

  const title = pathname.includes('/edit') ? '编辑文章' : (titles[pathname] ?? '演示功能');

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
          <Link href="/studio" className="flex items-center gap-3 overflow-hidden">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary font-editorial text-lg font-black text-sidebar-primary-foreground">余</span>
            <span className="min-w-0 group-data-[collapsible=icon]:hidden">
              <strong className="block truncate font-editorial text-base">余白工作台</strong>
              <span className="block truncate font-mono text-[9px] uppercase tracking-[.16em] text-sidebar-foreground/50">Owner studio</span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>内容</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const active = item.href === '/studio'
                    ? pathname === item.href
                    : item.href === '/studio/posts'
                      ? pathname === '/studio/posts' || /^\/studio\/posts\/[^/]+\/edit$/.test(pathname)
                      : item.href === '/studio/posts/new'
                        ? pathname === '/studio/posts/new'
                        : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        render={<Link href={item.href} />}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="查看公开站" render={<Link href="/" />}>
                <ExternalLink /><span>查看公开站</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="退出演示" render={<Link href="/studio/login" />}>
                <LogOut /><span>退出演示</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-sidebar-accent p-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">YB</span>
            <span className="min-w-0 group-data-[collapsible=icon]:hidden"><strong className="block truncate text-xs">演示站主</strong><span className="block truncate text-[10px] text-sidebar-foreground/55">本地演示数据</span></span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-w-0 bg-[#f4f6fb]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl md:px-7">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border" />
            <h1 className="text-sm font-bold md:text-base">{title}</h1>
          </div>
          <Badge variant="outline" className="border-primary/25 bg-primary/5 font-mono text-[10px] uppercase tracking-[.12em] text-primary">Demo mode</Badge>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
