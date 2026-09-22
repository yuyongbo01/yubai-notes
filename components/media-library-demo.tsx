'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type MediaItem = {
  id: string;
  name: string;
  src: string;
  detail: string;
  uploaded?: boolean;
};

const starterMedia: MediaItem[] = [
  {
    id: 'ideas-constellation',
    name: '思考星图',
    src: '/images/ideas-constellation.png',
    detail: '1600 × 1000 · 文章封面',
  },
  {
    id: 'late-night-writing-desk',
    name: '深夜写作桌面',
    src: '/images/late-night-writing-desk.png',
    detail: '1600 × 1000 · 工作台横幅',
  },
];

export function MediaLibraryDemo() {
  const [items, setItems] = useState<MediaItem[]>(starterMedia);
  const [notice, setNotice] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const accepted = Array.from(files).filter((file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);
    if (!accepted.length) {
      setNotice('请选择不超过 5 MB 的 PNG、JPG 或 WebP 图片。');
      return;
    }

    const next = accepted.map((file, index) => {
      const src = URL.createObjectURL(file);
      objectUrls.current.push(src);
      return {
        id: `local-${Date.now()}-${index}`,
        name: file.name,
        src,
        detail: `${Math.max(1, Math.round(file.size / 1024))} KB · 本地预览`,
        uploaded: true,
      } satisfies MediaItem;
    });
    setItems((current) => [...next, ...current]);
    setNotice(`已加入 ${next.length} 张图片；Demo 只在当前页面预览，不会上传到服务器。`);
  };

  const removeItem = (item: MediaItem) => {
    setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    if (item.uploaded) URL.revokeObjectURL(item.src);
    setNotice(`已从演示媒体库移除「${item.name}」。`);
  };

  return (
    <div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={(event) => {
          addFiles(event.target.files);
          event.currentTarget.value = '';
        }}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.14em] text-muted-foreground">Media library</p>
          <h2 className="mt-2 font-editorial text-3xl font-black">媒体库</h2>
          <p className="mt-2 text-sm text-muted-foreground">浏览站点素材，或加入本地图片查看卡片效果。</p>
        </div>
        <Button className="h-10 rounded-full px-4" onClick={() => inputRef.current?.click()}>
          <Upload /> 选择本地图片
        </Button>
      </div>

      {notice && (
        <output className="mt-5 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          <ImagePlus className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
          <button type="button" className="ml-auto font-bold" onClick={() => setNotice('')} aria-label="关闭提示">×</button>
        </output>
      )}

      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[1.35rem] border border-border bg-card">
            <img src={item.src} alt={item.name} className="aspect-[16/10] w-full bg-muted object-cover" />
            <div className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold">{item.name}</h3>
                  {item.uploaded && <Badge variant="secondary">本地</Badge>}
                </div>
                <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{item.detail}</p>
              </div>
              {item.uploaded && (
                <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item)} aria-label={`移除 ${item.name}`}>
                  <Trash2 />
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
