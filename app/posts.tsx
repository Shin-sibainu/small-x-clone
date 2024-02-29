"use client";

import { useOptimistic } from "react";
import Likes from "./likes";

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

  return optimisticPosts.map((post) => (
    <div key={post.id}>
      <p>
        {post.author.name} {post.author.username}
      </p>
      <p>{post.title}</p>
      <Likes post={post} addOptimisticPost={addOptimisticPost} />
    </div>
  ));
}
