import { Post } from "@prisma/client";
import Link from "next/link";
import { PostOperations } from "./post-operations";

interface PostItemProps {
  post: Pick<Post, "id" | "title" | "published" | "createdAt">;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${post.id}`}
          className="font-semibold hover:underline"
        >
          {post.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {post.createdAt?.toDateString()}
          </p>
        </div>
      </div>
      <PostOperations post={{ id: post.id, title: post.title }} />
      
    </div>
  );
}
