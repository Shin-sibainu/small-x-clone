import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default function NewPost() {
  const addPost = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("Posts").insert({ title, user_id: user?.id });

    revalidatePath("/");
  };

  return (
    <form className="border border-gray-800 border-t-0" action={addPost}>
      <div className="flex py-8 px-4">
        <div className="bg-orange-400">Image</div>
        <input name="title" className="bg-blue-400 flex-1" />
      </div>
    </form>
  );
}
