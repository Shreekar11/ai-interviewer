import { getUser } from "@/queries/user";
import { AuthForm } from "@/components/auth/auth-form";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const user = await getUser();
  if (user) {
    return redirect("/");
  }

  return <AuthForm mode="signup" />;
}