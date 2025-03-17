"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../../../../supabase/client";

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

      const supabase = await createClient();
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
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

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
          {isLoading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Setting up your account
              </h2>
              <p className="text-gray-600">
                Please wait while we complete your registration...
              </p>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Something went wrong
              </h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={handleSaveUser}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
