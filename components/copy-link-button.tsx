'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

export function CopyLinkButton() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const copyLink = async () => {
    const fallbackCopy = () => {
      const field = document.createElement('textarea');
      field.value = window.location.href;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      try {
        return document.execCommand('copy');
      } finally {
        field.remove();
      }
    };

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(window.location.href);
        } catch {
          if (!fallbackCopy()) throw new Error('copy unavailable');
        }
      } else if (!fallbackCopy()) {
        throw new Error('copy unavailable');
      }
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    window.setTimeout(() => setStatus('idle'), 1800);
  };

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary"
      type="button"
      onClick={copyLink}
      aria-live="polite"
    >
      {status === 'copied' ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />} {status === 'copied' ? '已复制' : status === 'error' ? '复制失败' : '复制链接'}
    </button>
  );
}
