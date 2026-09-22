'use client';

import { useEffect, useState } from 'react';
import { Check, RotateCcw, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const storageKey = 'yubai-demo-settings';
const defaults = {
  siteTitle: '余白手记',
  language: '简体中文（zh-CN）',
  description: '记录产品、技术与日常观察。不是答案仓库，而是一份持续修订的思考现场。',
  authorName: '演示作者',
  timezone: 'Asia/Shanghai',
  authorBio: '写产品、技术，以及它们如何改变我们的日常判断。',
};

type Settings = typeof defaults;

export function StudioSettingsForm() {
  const [values, setValues] = useState<Settings>(defaults);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setValues({ ...defaults, ...JSON.parse(stored) as Partial<Settings> });
    } catch {
      setMessage('未能读取上次保存的设置，已显示演示默认值。');
    }
  }, []);

  const update = (field: keyof Settings, value: string) => setValues((current) => ({ ...current, [field]: value }));

  const save = () => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
      setMessage('已保存到此浏览器，刷新页面后仍会保留。');
    } catch {
      setMessage('浏览器未允许保存设置，请检查本地存储权限。');
    }
  };

  const reset = () => {
    setValues(defaults);
    try {
      window.localStorage.removeItem(storageKey);
      setMessage('已恢复演示默认设置。');
    } catch {
      setMessage('已恢复当前表单，但浏览器未允许清除已保存设置。');
    }
  };

  return (
    <form className="max-w-3xl space-y-6" onSubmit={(event) => { event.preventDefault(); save(); }}>
      <section className="rounded-[1.4rem] border border-border bg-card p-6">
        <h3 className="font-editorial text-xl font-bold">基础信息</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="site-title">博客名称</Label><Input id="site-title" required value={values.siteTitle} onChange={(event) => update('siteTitle', event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="site-language">站点语言</Label><Input id="site-language" required value={values.language} onChange={(event) => update('language', event.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="site-description">站点简介</Label><Textarea id="site-description" required value={values.description} onChange={(event) => update('description', event.target.value)} /></div>
        </div>
      </section>
      <section className="rounded-[1.4rem] border border-border bg-card p-6">
        <h3 className="font-editorial text-xl font-bold">作者资料</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="author-name">显示名称</Label><Input id="author-name" required value={values.authorName} onChange={(event) => update('authorName', event.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="timezone">时区</Label><Input id="timezone" required value={values.timezone} onChange={(event) => update('timezone', event.target.value)} /></div>
          <div className="space-y-2 sm:col-span-2"><Label htmlFor="author-bio">一句介绍</Label><Textarea id="author-bio" required value={values.authorBio} onChange={(event) => update('authorBio', event.target.value)} /></div>
        </div>
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="rounded-full px-5"><Save /> 保存设置</Button>
        <Button type="button" variant="outline" className="rounded-full" onClick={reset}><RotateCcw /> 恢复默认</Button>
        {message && <output className="flex items-center gap-1.5 text-sm font-semibold text-primary"><Check className="size-4" /> {message}</output>}
      </div>
    </form>
  );
}
