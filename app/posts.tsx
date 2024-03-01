"use client";

import { useEffect, useOptimistic } from "react";
import Likes from "./likes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Posts({ posts }: { posts: PostWithAuthor[] }) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic<
    PostWithAuthor[],
    PostWithAuthor
  >(posts, (currentOptimisticPosts, newPost) => {
    const newOptimisticPosts = [...currentOptimisticPosts];
    const index = newOptimisticPosts.findIndex(
      (post) => post.id === newPost.id
    );
    newOptimisticPosts[index] = newPost;
    return newOptimisticPosts;
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Posts",
        },
        (payload) => {
          console.log({ payload });
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return optimisticPosts.map((post) => (
    <div key={post.id} className="border-gray-800 border-t-0 py-4 px-8 flex">
      <div className="h-12 w-12">
        <Image
          src={post.author.avatar_url}
          alt="post user avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="ml-4">
        <p>
          <span className="font-bold">{post.author.name}</span>
          <span className="text-sm ml-2 text-gray-400">
            {post.author.username}
          </span>
        </p>
        <p>{post.title}</p>
        <Likes post={post} addOptimisticPost={addOptimisticPost} />
      </div>
    </div>
  ));
}
