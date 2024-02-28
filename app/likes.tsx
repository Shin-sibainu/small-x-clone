"use client";

export default function Likes({ post }) {
  console.log(post);
  return <button>{post.likes.length}いいね</button>;
}
