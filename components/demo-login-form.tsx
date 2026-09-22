'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DemoLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setLoading(true);
        window.setTimeout(() => router.push('/studio'), 420);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="demo-email">站主邮箱</Label>
        <Input id="demo-email" name="email" type="email" required defaultValue="owner@demo.local" className="h-11" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="demo-password">密码</Label>
        <Input id="demo-password" name="password" type="password" required minLength={6} defaultValue="demopassword" className="h-11" />
      </div>
      <Button type="submit" size="lg" className="h-11 w-full rounded-xl" disabled={loading}>
        {loading ? '正在进入…' : '进入演示工作台'} {!loading && <ArrowRight />}
      </Button>
      <p className="flex items-start gap-2 rounded-xl bg-muted p-3 text-xs leading-5 text-muted-foreground">
        <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
        这是界面演示，不会提交或验证账号。正式版本会使用服务端身份验证。
      </p>
    </form>
  );
}
