"use client";

import { redirect } from "next/navigation";
import { useUser } from "@/context/user.context";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  const { user } = useUser();
  if (user.id) {
    return redirect("/");
  }

  return <AuthForm mode="signup" />;
}