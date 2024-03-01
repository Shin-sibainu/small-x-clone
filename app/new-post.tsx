import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Image from "next/image";
import SubmitButton from "./SubmitButton";

export default function NewPost({ user }: { user: User }) {
  const addPost = async (formData: FormData) => {
    "use server";
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

  return (
    <form className="border border-gray-800 border-t-0" action={addPost}>
      <div className="flex py-8 px-4 items-center">
        <div className="h-12 w-12">
          <Image
            src={user.user_metadata.avatar_url}
            width={48}
            height={48}
            alt="user avatar"
            className="rounded-s-full"
          />
        </div>
        <input
          name="title"
          className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-slate-500 px-2"
          placeholder="今何してる？"
        />
        <button
          type="submit"
          className="bg-slate-600 px-6 py-3 rounded-md ml-2"
        >
          送信
        </button>
      </div>
    </form>
  );
}
