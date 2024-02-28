import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./auth-button-client";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewPost from "./new-post";
import Likes from "./likes";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: posts } = await supabase
    .from("Posts")
    .select("*, profiles(*), likes(*)");

  return (
    <>
      <AuthButtonServer />
      <NewPost />
      <pre>{JSON.stringify(posts, null, 2)}</pre>
      {posts?.map((post) => (
        <div key={post.id}>
          <p>
            {post.profiles?.name} {post.profiles?.username}
          </p>
          <p>{post.title}</p>
          <Likes post={post} />
        </div>
      ))}
    </>
  );
}
