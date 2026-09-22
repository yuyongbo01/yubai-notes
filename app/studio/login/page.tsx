import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { DemoLoginForm } from '@/components/demo-login-form';

export default function StudioLoginPage() {
  return (
    <main className="paper-grid grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-[430px] rounded-[2rem] border border-border bg-card p-7 shadow-[0_30px_90px_rgba(20,35,90,.14)] md:p-9">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> 返回公开站</Link>
        <div className="mt-10 flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary font-editorial text-2xl font-black text-white">余</span>
          <div><h1 className="font-editorial text-2xl font-black">欢迎回来</h1><p className="mt-1 text-sm text-muted-foreground">登录后继续写作与发布</p></div>
        </div>
        <DemoLoginForm />
      </div>
    </main>
  );
}
