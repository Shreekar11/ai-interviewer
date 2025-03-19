import { createClient } from "../../supabase/client";

interface UserMetadata {
  name?: string;
  email?: string;
}

export const saveUserToSupabase = async (
  setError: (error: string | null) => void
) => {
  try {
    const supabase = createClient();
    const session = await supabase.auth.getUser();

    const {
      data: { user },
    } = session;

    if (!user) {
      throw new Error("No user found");
    }

    const { name, email } = user.user_metadata as UserMetadata;

    if (!email) {
      throw new Error("Email is required");
    }

    // Store in Supabase
    const { error: supabaseError } = await supabase.from("users").insert({
      first_name: name?.split(" ")[0] || "",
      last_name: name?.split(" ")[1] || "",
      email: email,
      auth_id: user.id,
    });

    if (supabaseError) {
      if (supabaseError.code === "23505") {
        throw new Error(
          "This email is already registered. Please use a different email."
        );
      }
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }
  } catch (err: any) {
    setError(err.message || "An error occurred during signup");
    console.error("Error: ", err);
    throw err;
  }
};
