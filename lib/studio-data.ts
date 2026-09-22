export type StudioStatus = '已发布' | '草稿' | '定时';

export type StudioPost = {
  id: string;
  title: string;
  status: StudioStatus;
  category: string;
  updated: string;
  publishAt: string;
  views?: string;
};

export const studioPosts: StudioPost[] = [
  { id: 'notes-are-a-conversation', title: '笔记不是仓库，而是一场缓慢发生的对话', status: '已发布', category: '创作系统', updated: '12 分钟前', publishAt: '2026.08.28', views: '1,284' },
  { id: 'small-rituals', title: '一些让写作重新发生的小仪式', status: '草稿', category: '创作系统', updated: '今天 09:42', publishAt: '—' },
  { id: 'why-own-a-small-website', title: '为什么我又开始维护一个小小的个人网站', status: '已发布', category: '独立网络', updated: '8 月 20 日', publishAt: '2026.08.19', views: '926' },
  { id: 'september-letter', title: '九月：重新整理信息的入口', status: '定时', category: '月度来信', updated: '昨天 23:18', publishAt: '2026.09.12 08:00' },
  { id: 'tools-like-paper', title: '把复杂工具做得像一张纸', status: '已发布', category: '产品手记', updated: '8 月 8 日', publishAt: '2026.08.07', views: '2,107' },
  { id: 'unfinished-interface', title: '还没有完成的界面，也能说明什么', status: '草稿', category: '设计观察', updated: '9 月 1 日', publishAt: '—' },
];
