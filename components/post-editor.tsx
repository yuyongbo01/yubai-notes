'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Bold, Check, ChevronLeft, Clock3, Code2, Eye, Heading2, ImagePlus, Italic, List, Monitor, Quote, Save, Send, Smartphone, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { studioPosts, type StudioPost } from '@/lib/studio-data';

type DraftInput = { title?: string; excerpt?: string; body?: string; category?: string; slug?: string; tags?: string; cover?: string };
type EditorSnapshot = { title: string; excerpt: string; body: string; category: string; slug: string; tags: string; cover: string };
type ToolRegistration = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: ToolRegistration, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
  }
}

const initialBody = `## 收藏并不等于理解

我曾经把笔记软件当成一个更聪明的仓库：网页被剪藏，句子被高亮，灵感被迅速扔进收件箱。数量增长得很快，理解却没有同步发生。

问题不在工具，而在动作本身。收藏只完成了搬运；真正的思考，往往从重写、连接和反驳开始。

> 好的笔记系统不是替你记住一切，而是让值得继续的问题有机会回来。

## 一个足够小的循环

- 捕捉一句话
- 补上一点自己的判断
- 连到一个旧问题
- 在周末挑一条继续写`;

const coverOptions = [
  { src: '/images/ideas-constellation.png', alt: '纸张、墨迹与蓝色光点连接成思考星图', name: '思考星图' },
  { src: '/images/late-night-writing-desk.png', alt: '深夜灯光下的写作桌面', name: '深夜写作桌面' },
];

function persistDemoPublication({ id, storageKey, draft, status, publishAt }: { id: string; storageKey: string; draft: EditorSnapshot; status: '已发布' | '定时'; publishAt: string }) {
  window.localStorage.setItem(storageKey, JSON.stringify(draft));
  window.localStorage.setItem(`yubai-demo-post-${id}`, JSON.stringify(draft));

  const stored = window.localStorage.getItem('yubai-demo-studio-posts');
  const parsed = stored ? JSON.parse(stored) as StudioPost[] : studioPosts;
  const list = Array.isArray(parsed) ? parsed : studioPosts;
  const nextPost: StudioPost = {
    id,
    title: draft.title.trim(),
    status,
    category: draft.category,
    updated: '刚刚',
    publishAt,
    views: status === '已发布' ? '0' : undefined,
  };
  const index = list.findIndex((post) => post.id === id);
  const nextList = [...list];
  if (index >= 0) nextList[index] = { ...nextList[index], ...nextPost };
  else nextList.unshift(nextPost);
  window.localStorage.setItem('yubai-demo-studio-posts', JSON.stringify(nextList));
}

function InlineMarkdown({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|_([^_]+)_|`([^`]+)`)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    if (match[2]) nodes.push(<strong key={`${match.index}-strong`}>{match[2]}</strong>);
    else if (match[3]) nodes.push(<em key={`${match.index}-em`}>{match[3]}</em>);
    else if (match[4]) nodes.push(<code key={`${match.index}-code`} className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{match[4]}</code>);
    cursor = pattern.lastIndex;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <>{nodes}</>;
}

function PreviewBody({ body }: { body: string }) {
  return (
    <div className="space-y-4 font-editorial text-[17px] leading-8 text-foreground/85">
      {body.split('\n').filter(Boolean).map((line, index) => {
        const image = line.match(/^!\[([^\]]*)\]\((\/[^)]+|https?:\/\/[^)]+)\)$/);
        if (image) return <img key={index} src={image[2]} alt={image[1]} className="my-6 aspect-[16/10] w-full rounded-2xl object-cover" />;
        if (line.startsWith('## ')) return <h3 key={index} className="pt-5 text-2xl font-black text-foreground"><InlineMarkdown text={line.slice(3)} /></h3>;
        if (line.startsWith('> ')) return <blockquote key={index} className="border-l-4 border-lime bg-muted px-5 py-4 text-lg font-bold text-foreground"><InlineMarkdown text={line.slice(2)} /></blockquote>;
        if (line.startsWith('- ')) return <p key={index} className="pl-4 before:mr-3 before:text-primary before:content-['•']"><InlineMarkdown text={line.slice(2)} /></p>;
        return <p key={index}><InlineMarkdown text={line} /></p>;
      })}
    </div>
  );
}

export function PostEditor({ mode = 'new', draftId, initialTitle, initialExcerpt, initialBody: startingBody, initialSlug, initialCategory = '创作系统', initialTags }: { mode?: 'new' | 'edit'; draftId?: string; initialTitle?: string; initialExcerpt?: string; initialBody?: string; initialSlug?: string; initialCategory?: string; initialTags?: string }) {
  const storageKey = `yubai-demo-post-${draftId ?? mode}`;
  const [title, setTitle] = useState(initialTitle ?? (mode === 'edit' ? '笔记不是仓库，而是一场缓慢发生的对话' : '给这篇文章一个标题'));
  const [excerpt, setExcerpt] = useState(initialExcerpt ?? (mode === 'edit' ? '这是一篇仍在继续修订的演示文章。' : '用一两句话告诉读者，这篇文章会谈什么。'));
  const [body, setBody] = useState(startingBody ?? (mode === 'edit' ? initialBody : '## 从这里开始\n\n写下第一个完整的想法。'));
  const [slug, setSlug] = useState(initialSlug ?? (mode === 'edit' ? draftId ?? 'untitled-note' : 'untitled-note'));
  const [category, setCategory] = useState(initialCategory);
  const [tags, setTags] = useState(initialTags ?? `${initialCategory}, 思考方式`);
  const [cover, setCover] = useState(coverOptions[0].src);
  const [schedule, setSchedule] = useState('2026-09-12T08:00');
  const [saveState, setSaveState] = useState<'未保存' | '保存中' | '已保存' | '保存失败'>('已保存');
  const [notice, setNotice] = useState('');
  const [noticeTone, setNoticeTone] = useState<'success' | 'error'>('success');
  const [hydrated, setHydrated] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const stateRef = useRef<EditorSnapshot>({ title, excerpt, body, category, slug, tags, cover });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as DraftInput;
        if (parsed.title) setTitle(parsed.title);
        if (parsed.excerpt) setExcerpt(parsed.excerpt);
        if (parsed.body) setBody(parsed.body);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.slug) setSlug(parsed.slug);
        if (parsed.tags) setTags(parsed.tags);
        if (parsed.cover && coverOptions.some((option) => option.src === parsed.cover)) setCover(parsed.cover);
      }
    } catch {
      setSaveState('保存失败');
    } finally {
      setHydrated(true);
    }
  }, [storageKey]);

  useEffect(() => {
    stateRef.current = { title, excerpt, body, category, slug, tags, cover };
    if (!hydrated) return;
    setSaveState('未保存');
    const saving = window.setTimeout(() => setSaveState('保存中'), 650);
    const saved = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ title, excerpt, body, slug, category, tags, cover }));
        setSaveState('已保存');
      } catch {
        setSaveState('保存失败');
      }
    }, 1100);
    return () => { window.clearTimeout(saving); window.clearTimeout(saved); };
  }, [body, category, cover, excerpt, hydrated, slug, storageKey, tags, title]);

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: ToolRegistration) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* unsupported preview context */ }
    };

    register({
      name: 'stage_blog_draft',
      title: '填写博客草稿',
      description: '在当前可见编辑器中填写标题、摘要、正文和分类，但不会发布。用于准备一篇博客草稿。',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1 },
          excerpt: { type: 'string' },
          body: { type: 'string', minLength: 1 },
          category: { type: 'string' },
        },
        required: ['title', 'body'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || typeof input !== 'object') throw new Error('草稿参数必须是对象');
        const value = input as DraftInput;
        if (!value.title?.trim() || !value.body?.trim()) throw new Error('标题和正文不能为空');
        setTitle(value.title.trim());
        setBody(value.body);
        if (typeof value.excerpt === 'string') setExcerpt(value.excerpt);
        if (typeof value.category === 'string' && value.category) setCategory(value.category);
        setNoticeTone('success');
        setNotice('AI 工具已将内容填入草稿，尚未发布。');
        return { status: 'staged', title: value.title.trim() };
      },
    });

    register({
      name: 'publish_blog_draft',
      title: '发布当前博客草稿',
      description: '发布当前编辑器里的博客草稿，并更新可见的发布状态。仅用于此演示。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() {
        const current = stateRef.current;
        if (!current.title.trim() || !current.body.trim()) throw new Error('标题和正文不能为空');
        const id = draftId ?? current.slug.trim();
        if (!id) throw new Error('固定链接不能为空');
        const publishAt = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
        persistDemoPublication({ id, storageKey, draft: current, status: '已发布', publishAt });
        setNoticeTone('success');
        setNotice('文章已在演示模式中发布，并同步到文章列表。');
        return { status: 'published', title: current.title };
      },
    });

    return () => lifecycle.abort();
  }, [draftId, storageKey]);

  const wordCount = useMemo(() => body.replace(/[#>*`-]/g, '').replace(/\s+/g, '').length, [body]);

  const insertMarkdown = (before: string, after = '') => {
    const field = bodyRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = body.slice(start, end) || '文字';
    const next = `${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`;
    setBody(next);
    window.requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const publish = (scheduled = false) => {
    if (!title.trim() || !body.trim() || !slug.trim()) {
      setNoticeTone('error');
      setNotice('发布前请补全标题、正文和固定链接。');
      return;
    }
    if (scheduled && (!schedule || Number.isNaN(new Date(schedule).getTime()))) {
      setNoticeTone('error');
      setNotice('请选择有效的定时发布时间。');
      return;
    }

    const publishAt = scheduled ? schedule.replace('T', ' ') : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const status = scheduled ? '定时' : '已发布';
    try {
      const id = draftId ?? slug.trim();
      persistDemoPublication({ id, storageKey, draft: { title, excerpt, body, category, slug, tags, cover }, status, publishAt });
    } catch {
      setNoticeTone('error');
      setNotice('文章内容已保留，但浏览器未允许更新演示文章列表。');
      return;
    }

    setNoticeTone('success');
    setNotice(scheduled ? `已安排在 ${publishAt} 发布，并同步到文章列表。` : '文章已在演示模式中发布，并同步到文章列表。');
    setSaveState('已保存');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/92 px-4 py-3 backdrop-blur-xl md:px-7">
        <div className="flex items-center gap-3">
          <Link href="/studio/posts" className="grid size-8 place-items-center rounded-lg hover:bg-muted" aria-label="返回文章列表"><ChevronLeft className="size-4" /></Link>
          <span className={`flex items-center gap-1.5 font-mono text-[11px] ${saveState === '保存失败' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {saveState === '已保存' ? <Check className="size-3.5 text-emerald-600" /> : <Save className="size-3.5" />} {saveState}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" className="rounded-full" />}><Eye /> 预览</DialogTrigger>
            <DialogContent className="max-h-[92vh] max-w-[min(1100px,calc(100%-2rem))] overflow-auto p-0">
              <DialogHeader className="border-b border-border px-6 py-4"><DialogTitle>文章预览</DialogTitle><DialogDescription>检查桌面和移动端的阅读效果。</DialogDescription></DialogHeader>
              <Tabs defaultValue="desktop" className="gap-0">
                <div className="flex justify-center border-b border-border bg-muted/40 py-3"><TabsList><TabsTrigger value="desktop"><Monitor /> 桌面</TabsTrigger><TabsTrigger value="mobile"><Smartphone /> 手机</TabsTrigger></TabsList></div>
                {(['desktop', 'mobile'] as const).map((device) => (
                  <TabsContent key={device} value={device} className="bg-[#e9edf5] p-4 md:p-8">
                    <div className={`mx-auto min-h-[580px] bg-background p-7 shadow-xl transition-all ${device === 'mobile' ? 'max-w-[390px]' : 'max-w-[820px] md:p-14'}`}>
                      <p className="font-mono text-xs font-bold uppercase tracking-[.14em] text-primary">{category} · 预览</p>
                      <h2 className="mt-5 font-editorial text-4xl font-black leading-tight tracking-[-.04em] md:text-5xl">{title || '无标题文章'}</h2>
                      <p className="mt-5 text-lg leading-8 text-muted-foreground">{excerpt}</p>
                      <div className="my-8 h-px bg-border" />
                      <PreviewBody body={body} />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger render={<Button className="rounded-full" />}><Send /> {mode === 'edit' ? '更新发布' : '发布'}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle className="text-lg">发布前确认</DialogTitle><DialogDescription>以下内容会写入此浏览器的演示文章列表；不会修改公开站或发送邮件。</DialogDescription></DialogHeader>
              <div className="rounded-xl border border-border bg-muted/45 p-4">
                <p className="font-editorial text-lg font-bold">{title || '无标题文章'}</p>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">/posts/{slug}</p>
                <div className="mt-4 flex gap-2"><Badge>{category}</Badge><Badge variant="outline">{wordCount} 字</Badge></div>
              </div>
              <div className="space-y-2"><Label htmlFor="schedule">定时发布（Asia/Shanghai）</Label><Input id="schedule" type="datetime-local" value={schedule} onChange={(event) => setSchedule(event.target.value)} /></div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" onClick={() => publish(true)} />}><Clock3 /> 定时发布</DialogClose>
                <DialogClose render={<Button onClick={() => publish(false)} />}><Send /> 立即发布</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {notice && <output className={`mx-4 mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm md:mx-7 ${noticeTone === 'error' ? 'border-destructive/25 bg-destructive/5 text-destructive' : 'border-primary/20 bg-primary/5 text-primary'}`}><Sparkles className="size-4" />{notice}<button type="button" className="ml-auto font-bold" onClick={() => setNotice('')} aria-label="关闭提示">×</button></output>}

      <div className="mx-auto grid max-w-[1280px] gap-5 p-4 md:p-7 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
          <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/35 px-3 py-2">
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertMarkdown('**', '**')} title="粗体" aria-label="粗体"><Bold /></Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertMarkdown('_', '_')} title="斜体" aria-label="斜体"><Italic /></Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertMarkdown('\n## ', '\n')} title="二级标题" aria-label="二级标题"><Heading2 /></Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertMarkdown('\n- ', '\n')} title="列表" aria-label="列表"><List /></Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertMarkdown('\n> ', '\n')} title="引用" aria-label="引用"><Quote /></Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertMarkdown('`', '`')} title="代码" aria-label="代码"><Code2 /></Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => insertMarkdown('\n![', '](/images/late-night-writing-desk.png)\n')} title="图片" aria-label="图片"><ImagePlus /></Button>
            <span className="ml-auto pr-2 font-mono text-[10px] text-muted-foreground">Markdown shortcuts</span>
          </div>
          <div className="px-5 py-7 md:px-10 md:py-10">
            <label htmlFor="post-title" className="sr-only">文章标题</label>
            <textarea id="post-title" value={title} onChange={(event) => setTitle(event.target.value)} rows={2} className="field-sizing-content w-full resize-none bg-transparent font-editorial text-4xl font-black leading-tight tracking-[-.04em] outline-none placeholder:text-muted-foreground/40 md:text-5xl" placeholder="给这篇文章一个标题" />
            <div className="my-7 h-px bg-border" />
            <label htmlFor="post-body" className="sr-only">文章正文</label>
            <Textarea ref={bodyRef} id="post-body" value={body} onChange={(event) => setBody(event.target.value)} className="min-h-[620px] resize-none border-0 p-0 font-editorial text-[17px] leading-8 shadow-none focus-visible:ring-0" placeholder="从第一个完整的想法开始…" />
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 font-mono text-[10px] text-muted-foreground md:px-10"><span>{wordCount} 字 · 约 {Math.max(1, Math.ceil(wordCount / 450))} 分钟</span><span>自动保存已开启</span></div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[1.35rem] border border-border bg-card p-5">
            <h2 className="text-sm font-bold">文章设置</h2>
            <div className="mt-5 space-y-5">
              <div className="space-y-2"><Label htmlFor="excerpt">摘要</Label><Textarea id="excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={4} className="min-h-24" /></div>
              <div className="space-y-2"><Label htmlFor="slug">固定链接</Label><div className="flex items-center rounded-lg border border-input bg-background px-2.5"><span className="font-mono text-[11px] text-muted-foreground">/posts/</span><input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} className="h-9 min-w-0 flex-1 bg-transparent font-mono text-xs outline-none" /></div></div>
              <div className="space-y-2"><Label>分类</Label><Select value={category} onValueChange={(value) => setCategory(value ?? '创作系统')}><SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger><SelectContent>{['创作系统', '产品手记', '独立网络', '设计观察', 'AI 与人', '月度来信'].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="tags">标签</Label><Input id="tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="用逗号分隔" /></div>
            </div>
          </section>

          <Dialog>
            <section className="overflow-hidden rounded-[1.35rem] border border-border bg-card">
              <img src={cover} alt={coverOptions.find((option) => option.src === cover)?.alt ?? '当前文章封面预览'} width="1600" height="1000" className="aspect-[16/9] w-full object-cover" />
              <div className="flex items-center justify-between p-4"><div><h2 className="text-sm font-bold">文章封面</h2><p className="mt-1 text-xs text-muted-foreground">1600 × 1000 · PNG</p></div><DialogTrigger render={<Button variant="outline" size="sm" />}>更换</DialogTrigger></div>
            </section>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader><DialogTitle>选择文章封面</DialogTitle><DialogDescription>从内置演示素材中选择一张图片，选择后会自动保存。</DialogDescription></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                {coverOptions.map((option) => (
                  <DialogClose
                    key={option.src}
                    render={<button type="button" aria-label={`选择封面：${option.name}`} className={`overflow-hidden rounded-xl border text-left transition hover:border-primary ${cover === option.src ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`} onClick={() => { setCover(option.src); setNoticeTone('success'); setNotice(`已将文章封面更换为「${option.name}」。`); }} />}
                  >
                    <img src={option.src} alt={option.alt} className="aspect-[16/10] w-full object-cover" />
                    <span className="block px-3 py-2 text-sm font-semibold">{option.name}</span>
                  </DialogClose>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <section className="rounded-[1.35rem] border border-border bg-card p-5">
            <h2 className="text-sm font-bold">SEO 与分享</h2>
            <div className="mt-4 space-y-4"><div className="space-y-2"><Label htmlFor="seo-title">搜索标题</Label><Input id="seo-title" value={title} onChange={(event) => setTitle(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="seo-description">搜索描述</Label><Textarea id="seo-description" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} /></div></div>
          </section>
        </aside>
      </div>
    </div>
  );
}
