import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./auth-button";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: posts } = await supabase.from("Posts").select();

  return (
    <>
      <AuthButton />
      <pre>{JSON.stringify(posts, null, 2)}</pre>
    </>
  );
}
