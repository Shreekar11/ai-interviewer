"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";
import { saveUserToSupabase } from "@/services/user.service";

interface UserMetadata {
  name?: string;
  email?: string;
}

const OnboardingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSaveUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await saveUserToSupabase(setError);

      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
      console.error("Error: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSaveUser();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="p-8 w-full max-w-md">
        <div className="text-center space-y-2">
          {isLoading && (
            <>
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Setting up your account
              </h2>
              <p className="text-gray-600">
                Please wait while we complete your registration...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
