"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const addPost = async (formData: FormData) => {
  const title = String(formData.get("title"));
  if (title.length === 0) {
    return;
  }
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("Posts").insert({ title, user_id: user?.id });

  revalidatePath("/");
};
