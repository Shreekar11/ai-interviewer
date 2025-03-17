import { redirect } from "next/navigation";
import { getUser } from "@/queries/user";
import { Login } from "@/components/auth/login-form";
export default async function SignInPage() {
  const user = await getUser();
  if (user) {
    return redirect("/");
  }

  return <Login mode="signin" />;
}