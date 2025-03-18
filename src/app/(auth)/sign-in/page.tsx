import { redirect } from "next/navigation";
import { getUser } from "@/queries/user";
import { AuthForm } from "@/components/auth/auth-form";

export default async function SignInPage() {
  
  const user = await getUser();
  if (user) {
    return redirect("/");
  }

  return <AuthForm mode="signin" />;
}