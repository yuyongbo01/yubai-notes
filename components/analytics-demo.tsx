'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock3, Eye, MousePointerClick } from 'lucide-react';

import { Button } from '@/components/ui/button';

const datasets = {
  '7 天': {
    visits: '1,284', reads: '842', duration: '4m 18s', delta: '+12.4%',
    bars: [34, 48, 41, 68, 57, 82, 74], labels: ['周六', '周日', '周一', '周二', '周三', '周四', '今天'],
  },
  '30 天': {
    visits: '5,936', reads: '3,721', duration: '3m 56s', delta: '+8.1%',
    bars: [42, 57, 51, 64, 72, 67, 88], labels: ['第 1 周', '第 2 周', '第 3 周', '第 4 周', '8/31', '9/1', '今天'],
  },
  '90 天': {
    visits: '17,408', reads: '10,962', duration: '4m 02s', delta: '+21.7%',
    bars: [29, 43, 52, 49, 66, 78, 92], labels: ['六月', '七月', '八月', '8/18', '8/25', '9/1', '今天'],
  },
} as const;

type Range = keyof typeof datasets;

export function AnalyticsDemo() {
  const [range, setRange] = useState<Range>('30 天');
  const data = datasets[range];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.14em] text-muted-foreground">Audience snapshot</p>
          <h2 className="mt-2 font-editorial text-3xl font-black">数据概览</h2>
          <p className="mt-2 text-sm text-muted-foreground">使用匿名演示数据查看访问趋势与热门内容。</p>
        </div>
        <div className="flex rounded-full border border-border bg-card p-1" aria-label="数据时间范围">
          {(Object.keys(datasets) as Range[]).map((item) => (
            <Button key={item} size="sm" variant={range === item ? 'default' : 'ghost'} className="rounded-full" onClick={() => setRange(item)}>
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          { label: '访问次数', value: data.visits, note: `${data.delta} 较上一周期`, icon: Eye },
          { label: '完整阅读', value: data.reads, note: '读到文章末尾', icon: MousePointerClick },
          { label: '平均停留', value: data.duration, note: '匿名聚合数据', icon: Clock3 },
        ].map((metric) => (
          <article key={metric.label} className="rounded-[1.35rem] border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div><p className="text-sm text-muted-foreground">{metric.label}</p><p className="mt-2 text-3xl font-black tracking-tight">{metric.value}</p></div>
              <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary"><metric.icon className="size-4" /></span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{metric.note}</p>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-[1.5rem] border border-border bg-card p-5 md:p-7">
        <div className="flex items-center justify-between">
          <div><h3 className="font-editorial text-xl font-bold">访问趋势</h3><p className="mt-1 text-xs text-muted-foreground">当前范围：{range}</p></div>
          <output className="rounded-full bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold text-primary">Demo data</output>
        </div>
        <div className="mt-8 grid h-52 grid-cols-7 items-end gap-2 sm:gap-4" aria-label={`${range}访问趋势柱状图`}>
          {data.bars.map((value, index) => (
            <div key={`${range}-${data.labels[index]}`} className="flex h-full flex-col justify-end gap-2">
              <div className="group relative flex-1">
                <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-primary/85 transition-[height] duration-500 group-hover:bg-primary" style={{ height: `${value}%` }}>
                  <span className="sr-only">相对访问量 {value}%</span>
                </div>
              </div>
              <span className="truncate text-center font-mono text-[9px] text-muted-foreground">{data.labels[index]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-border bg-card p-5 md:p-7">
        <h3 className="font-editorial text-xl font-bold">热门文章</h3>
        <div className="mt-5 divide-y divide-border">
          {[
            ['把复杂工具做得像一张纸', '2,107', 'tools-like-paper'],
            ['笔记不是仓库，而是一场缓慢发生的对话', '1,284', 'notes-are-a-conversation'],
            ['为什么我又开始维护一个小小的个人网站', '926', 'why-own-a-small-website'],
          ].map(([title, count, slug], index) => (
            <Link key={title} href={`/posts/${slug}`} className="flex items-center gap-4 py-4 transition-colors hover:text-primary">
              <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</span>
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">{count} <ArrowUpRight className="size-3.5" /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
