import { PostEditor } from '@/components/post-editor';

type PageProps = { searchParams: Promise<{ draft?: string }> };

export default async function NewPostPage({ searchParams }: PageProps) {
  const { draft } = await searchParams;
  return <PostEditor mode="new" draftId={draft} />;
}
