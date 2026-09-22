import { PostEditor } from '@/components/post-editor';
import { getPostBySlug, postContent } from '@/lib/demo-content';
import { studioPosts } from '@/lib/studio-data';
import { notFound } from 'next/navigation';

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = studioPosts.find((item) => item.id === id);
  if (!post) notFound();
  const publicPost = getPostBySlug(id);
  const sections = postContent[id];
  const initialBody = sections
    ? sections.map((section) => [`## ${section.heading}`, ...section.paragraphs, ...(section.quote ? [`> ${section.quote}`] : [])].join('\n\n')).join('\n\n')
    : `## ${post.title}\n\n${publicPost?.excerpt ?? '这篇演示草稿还在继续整理。'}\n\n在这里继续补充你的判断、例子与结论。`;
  return (
    <PostEditor
      mode="edit"
      draftId={id}
      initialTitle={post.title}
      initialExcerpt={publicPost?.excerpt ?? '这篇演示草稿还在继续整理。'}
      initialBody={initialBody}
      initialSlug={id}
      initialCategory={post.category}
      initialTags={publicPost?.tags.join(', ') ?? `${post.category}, 草稿`}
    />
  );
}
