"use client";

import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // const [session, setSession] = useState();

  // useEffect(() => {
  //   const getSession = async () => {
  //     // const { data } = await supabase.auth.getSession();
  //     setSession(data.session);
  //   };

  //   getSession();
  // }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      {session ? (
        <button className="text-xs text-gray-400" onClick={handleSignOut}>
          ログアウト
        </button>
      ) : (
        <button className="text-xs text-gray-400" onClick={handleSignIn}>
          サインイン
        </button>
      )}
    </>
  );
}
