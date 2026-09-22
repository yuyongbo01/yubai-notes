'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Copy, ExternalLink, MoreHorizontal, PenLine, RotateCcw, Search, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StudioPost, StudioStatus } from '@/lib/studio-data';

const filters = ['全部', '已发布', '草稿', '定时'] as const;
const storageKey = 'yubai-demo-studio-posts';

export function StudioPostsTable({ posts }: { posts: StudioPost[] }) {
  const [items, setItems] = useState(posts);
  const [filter, setFilter] = useState<(typeof filters)[number]>('全部');
  const [query, setQuery] = useState('');
  const [previewPost, setPreviewPost] = useState<StudioPost | null>(null);
  const [pendingDelete, setPendingDelete] = useState<StudioPost | null>(null);
  const [removed, setRemoved] = useState<{ post: StudioPost; index: number } | null>(null);
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const originalIds = useMemo(() => new Set(posts.map((post) => post.id)), [posts]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as StudioPost[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      setNotice('未能读取上次的演示状态，本次改动仍可继续使用。');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      setNotice('浏览器未允许保存演示状态，刷新后改动会复原。');
    }
  }, [hydrated, items]);

  const visible = useMemo(
    () => items.filter((post) => (filter === '全部' || post.status === filter) && post.title.toLowerCase().includes(query.trim().toLowerCase())),
    [filter, items, query],
  );

  const badgeVariant = (status: StudioStatus) => status === '已发布' ? 'secondary' : status === '定时' ? 'outline' : 'default';
  const editHref = (post: StudioPost) => originalIds.has(post.id) ? `/studio/posts/${post.id}/edit` : `/studio/posts/new?draft=${encodeURIComponent(post.id)}`;

  const duplicatePost = (post: StudioPost) => {
    const prefix = `${post.id}-copy-`;
    const copyNumber = Math.max(0, ...items.map((item) => item.id.startsWith(prefix) ? Number.parseInt(item.id.slice(prefix.length), 10) || 0 : 0)) + 1;
    const copy: StudioPost = {
      ...post,
      id: `${prefix}${copyNumber}`,
      title: `${post.title}（副本）`,
      status: '草稿',
      updated: '刚刚',
      publishAt: '—',
      views: undefined,
    };
    setItems((current) => [copy, ...current]);
    setFilter('全部');
    setQuery('');
    setRemoved(null);
    try {
      const source = window.localStorage.getItem(`yubai-demo-post-${post.id}`);
      const draft = source ? JSON.parse(source) as Record<string, unknown> : { excerpt: '这是从现有文章复制出的演示草稿。', body: '## 复制后的草稿\n\n在这里继续修改文章内容。' };
      window.localStorage.setItem(`yubai-demo-post-${copy.id}`, JSON.stringify({ ...draft, title: copy.title, category: copy.category, slug: copy.id }));
    } catch {
      // The list action still works even when the browser blocks draft persistence.
    }
    setNotice(`已复制「${post.title}」，新副本已放到列表顶部。`);
  };

  const removePost = () => {
    if (!pendingDelete) return;
    const index = items.findIndex((post) => post.id === pendingDelete.id);
    setItems((current) => current.filter((post) => post.id !== pendingDelete.id));
    setRemoved({ post: pendingDelete, index: Math.max(0, index) });
    setNotice(`已从演示列表移除「${pendingDelete.title}」。`);
    setPendingDelete(null);
  };

  const undoRemove = () => {
    if (!removed) return;
    setItems((current) => {
      if (current.some((post) => post.id === removed.post.id)) return current;
      const next = [...current];
      next.splice(Math.min(removed.index, next.length), 0, removed.post);
      return next;
    });
    setNotice(`已恢复「${removed.post.title}」。`);
    setRemoved(null);
  };

  return (
    <>
      {notice && (
        <output className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          <span className="min-w-0 flex-1">{notice}</span>
          {removed && <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={undoRemove}><RotateCcw /> 撤销</Button>}
          <button type="button" className="font-bold" onClick={() => setNotice('')} aria-label="关闭提示">×</button>
        </output>
      )}

      <div className="overflow-hidden rounded-[1.4rem] border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <TabsList>
              {filters.map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}
            </TabsList>
          </Tabs>
          <div className="relative block w-full lg:w-64">
            <label htmlFor="studio-post-search" className="sr-only">搜索文章</label><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="studio-post-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章标题…" className="h-9 rounded-full bg-background pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead className="min-w-[310px] px-5">文章</TableHead><TableHead>状态</TableHead><TableHead>发布时间</TableHead><TableHead>最近修改</TableHead><TableHead className="w-14"><span className="sr-only">操作</span></TableHead></TableRow></TableHeader>
          <TableBody>
            {visible.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="px-5 py-4"><Link href={editHref(post)} className="block font-semibold hover:text-primary">{post.title}<span className="mt-1 block text-xs font-normal text-muted-foreground">{post.category}{post.views ? ` · ${post.views} 次阅读` : ''}</span></Link></TableCell>
                <TableCell><Badge variant={badgeVariant(post.status)}>{post.status}</Badge></TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{post.publishAt}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{post.updated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`操作：${post.title}`} />}><MoreHorizontal /></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem render={<Link href={editHref(post)} />}><PenLine /> 编辑</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPreviewPost(post)}><ExternalLink /> 预览</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicatePost(post)}><Copy /> 复制文章</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(post)}><Trash2 /> 从列表移除</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!visible.length && <div className="border-t border-border px-5 py-14 text-center"><p className="font-semibold">没有匹配的文章</p><p className="mt-1 text-sm text-muted-foreground">尝试清除搜索或切换状态。</p><Button variant="outline" className="mt-4 rounded-full" onClick={() => { setFilter('全部'); setQuery(''); }}>查看全部文章</Button></div>}
      </div>

      <Dialog open={Boolean(previewPost)} onOpenChange={(open) => { if (!open) setPreviewPost(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-editorial text-2xl font-bold">{previewPost?.title}</DialogTitle>
            <DialogDescription>这是文章在公开站中的摘要预览。</DialogDescription>
          </DialogHeader>
          {previewPost && (
            <div className="rounded-2xl border border-border bg-muted/45 p-5">
              <div className="flex items-center gap-2"><Badge variant={badgeVariant(previewPost.status)}>{previewPost.status}</Badge><span className="font-mono text-[10px] text-muted-foreground">{previewPost.category}</span></div>
              <p className="mt-5 font-editorial text-lg leading-8 text-foreground/80">这是一段用于检查标题、状态和阅读节奏的演示摘要。进入编辑器后可修改完整内容并再次预览。</p>
              <p className="mt-5 font-mono text-[10px] text-muted-foreground">最近修改：{previewPost.updated}</p>
            </div>
          )}
          <DialogFooter><DialogClose render={<Button variant="outline" />}>关闭预览</DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>从演示列表移除？</AlertDialogTitle>
            <AlertDialogDescription>「{pendingDelete?.title}」会从当前列表移除。操作后仍可立即撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={removePost}>从列表移除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
