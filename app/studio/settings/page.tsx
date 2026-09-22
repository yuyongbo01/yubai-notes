import { StudioSettingsForm } from '@/components/studio-settings-form';

export default function StudioSettingsPage() {
  return <div className="mx-auto w-full max-w-[1220px] p-4 md:p-8"><p className="font-mono text-xs uppercase tracking-[.14em] text-muted-foreground">Site preferences</p><h2 className="mt-2 font-editorial text-3xl font-black tracking-[-.03em]">站点设置</h2><p className="mb-7 mt-2 text-sm text-muted-foreground">调整演示身份、语言与时区；设置只保存在当前浏览器。</p><StudioSettingsForm /></div>;
}
