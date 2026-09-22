export type DemoPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  dateLabel: string;
  readTime: string;
  featured?: boolean;
};

export const posts: DemoPost[] = [
  {
    slug: 'notes-are-a-conversation',
    title: '笔记不是仓库，而是一场缓慢发生的对话',
    excerpt: '当我们停止囤积信息，开始让旧问题和新经验彼此碰撞，笔记才真正成为思考的一部分。',
    category: '创作系统',
    tags: ['创作系统', '思考方式'],
    date: '2026-08-28',
    dateLabel: '2026.08.28',
    readTime: '8 分钟',
    featured: true,
  },
  {
    slug: 'why-own-a-small-website',
    title: '为什么我又开始维护一个小小的个人网站',
    excerpt: '在平台变得越来越喧闹之后，一块可以自己决定节奏、结构和边界的地方，重新显得珍贵。',
    category: '独立网络',
    tags: ['独立网络', '个人网站'],
    date: '2026-08-19',
    dateLabel: '2026.08.19',
    readTime: '6 分钟',
  },
  {
    slug: 'tools-like-paper',
    title: '把复杂工具做得像一张纸',
    excerpt: '好的工具不必看起来简单，但应该让关键动作自然浮到手边，让人在使用时不必反复翻译自己的意图。',
    category: '产品手记',
    tags: ['产品手记', '设计观察'],
    date: '2026-08-07',
    dateLabel: '2026.08.07',
    readTime: '11 分钟',
  },
  {
    slug: 'eleven-pm-writing-system',
    title: '夜里十一点的写作系统',
    excerpt: '不是更严格的日程表，而是一套允许疲惫、分心和偶尔中断，却仍能把文字留下来的轻量方法。',
    category: '创作系统',
    tags: ['创作系统', '日常'],
    date: '2026-07-24',
    dateLabel: '2026.07.24',
    readTime: '5 分钟',
  },
  {
    slug: 'ai-and-useful-friction',
    title: 'AI 时代，我们仍然需要一点有用的阻力',
    excerpt: '速度不是每个环节的唯一目标。有些停顿帮助我们形成判断，也让作品真正带上自己的声音。',
    category: 'AI 与人',
    tags: ['AI 与人', '思考方式'],
    date: '2026-07-11',
    dateLabel: '2026.07.11',
    readTime: '9 分钟',
  },
];

export const featuredPost = posts[0];

export const postContent: Record<
  string,
  Array<{ heading: string; paragraphs: string[]; quote?: string }>
> = {
  'notes-are-a-conversation': [
    {
      heading: '收藏并不等于理解',
      paragraphs: [
        '我曾经把笔记软件当成一个更聪明的仓库：网页被剪藏，句子被高亮，灵感被迅速扔进收件箱。数量增长得很快，理解却没有同步发生。',
        '问题不在工具，而在动作本身。收藏只完成了搬运；真正的思考，往往从重写、连接和反驳开始。',
      ],
    },
    {
      heading: '让旧问题重新出现',
      paragraphs: [
        '后来我给系统加了一条有点反直觉的规则：不要总是寻找新材料，每周先随机打开三条旧笔记。它们常常不完整，甚至已经过时，却会与这一周的经验产生新的摩擦。',
        '一条笔记最有价值的时刻，不一定是写下它的时候，而可能是半年后，当另一个问题让它突然改变含义。',
      ],
      quote: '好的笔记系统不是替你记住一切，而是让值得继续的问题有机会回来。',
    },
    {
      heading: '一个足够小的循环',
      paragraphs: [
        '现在我的流程只剩四步：捕捉一句话，补上一点自己的判断，连到一个旧问题，然后在周末挑一条继续写。没有复杂分类，也不追求收件箱清零。',
        '这套循环的产物不只是更整齐的笔记。它逐渐形成一张带有时间痕迹的地图：我曾经相信什么，后来为什么改变，又有哪些问题仍然没有答案。',
      ],
    },
  ],
};

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
