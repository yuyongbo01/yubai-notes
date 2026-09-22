import { PostEditor } from '@/components/post-editor';

export const dynamic = 'force-static';

export default function NewPostPage() {
  return <PostEditor mode="new" />;
}
