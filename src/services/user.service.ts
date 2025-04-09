import { createClient } from "@/utils/supabase/client";

interface UserMetadata {
  name?: string;
  email?: string;
}

/**
 * Service for handling user-related operations
 */
export class UserService {
  /**
   * Save a new user to Supabase after authentication
   * @param setError Function to set error messages
   * @returns Object containing user data or success message
   */
  public async saveUserToSupabase(setError: (error: string | null) => void) {
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

      const { data: existingUser } = await supabase
        .from("users")
        .select()
        .eq("auth_id", user.id)
        .single();

      if (existingUser) {
        return {
          status: true,
          message: "User already exists",
          userData: existingUser,
          isNewUser: false,
        };
      }

      const { error: supabaseError, data } = await supabase
        .from("users")
        .insert({
          first_name: name?.split(" ")[0] || "",
          last_name: name?.split(" ")[1] || "",
          email: email,
          auth_id: user.id,
        })
        .select();

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          throw new Error(
            "This email is already registered. Please use a different email."
          );
        }
        throw new Error(`Supabase error: ${supabaseError.message}`);
      }

      return {
        status: true,
        message: "User successfully registered",
        userData: data?.[0] || null,
        isNewUser: true,
      };
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
      console.error("Error: ", err);
      throw err;
    }
  }

  /**
   * Get the current authenticated user
   * @returns The authenticated user or null
   */
  static async getCurrentUser() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data.user;
  }

  /**
   * Get a user by their auth ID
   * @param authUserId The auth ID of the user to retrieve
   * @returns User data with status and message
   */
  public async getAuthUser(authUserId: string) {
    try {
      const supabase = createClient();

      // Verify supabase client was initialized properly
      if (!supabase) {
        return {
          status: false,
          message: "Failed to initialize Supabase client",
          error: "SUPABASE_INIT_ERROR",
        };
      }

      // Get the user record from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*") // Select all fields to ensure we get complete user data
        .eq("auth_id", authUserId)
        .single();

      // Log query information for debugging
      console.log("Auth ID searched:", authUserId);
      console.log("User data result:", userData);

      if (userError) {
        console.error("Database error fetching user:", userError);
        return {
          status: false,
          message: `Error fetching user: ${userError.message}`,
          error: "DATABASE_ERROR",
        };
      }

      if (!userData) {
        return {
          status: false,
          message: "User account not found. Please complete registration.",
          error: "USER_NOT_FOUND",
        };
      }

      return {
        status: true,
        message: "User found successfully",
        data: userData,
      };
    } catch (error: any) {
      console.error("Unexpected error in getAuthUser:", error);
      return {
        status: false,
        message: `Unexpected error: ${error.message || "Unknown error"}`,
        error: "UNEXPECTED_ERROR",
      };
    }
  }

  /**
   * Create a service client that bypasses RLS
   * @returns Supabase client with service role permissions
   */
  public createServiceClient() {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE;

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Missing Supabase service credentials");
      }

      // Import createClient directly from @supabase/supabase-js to create a service client
      // This is different from the standard client from @/utils/supabase/client
      const {
        createClient: createServiceSupabaseClient,
      } = require("@supabase/supabase-js");

      return createServiceSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (error: any) {
      console.error("Failed to create service client:", error);
      throw new Error(`Failed to initialize service client: ${error.message}`);
    }
  }

  /**
   * Get a user by their auth ID using the service client (bypasses RLS)
   * @param authUserId The auth ID of the user to retrieve
   * @returns User data with status and message
   */
  public async getAuthUserWithServiceRole(authUserId: string) {
    try {
      // Use service client to bypass RLS
      const supabase = this.createServiceClient();

      // Get the user record from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", authUserId)
        .single();

      if (userError) {
        console.error("Service client error:", userError);
        return {
          status: false,
          message: `Service client error: ${userError.message}`,
          error: "SERVICE_CLIENT_ERROR",
        };
      }

      if (!userData) {
        return {
          status: false,
          message: "User account not found with service client",
          error: "USER_NOT_FOUND",
        };
      }

      return {
        status: true,
        message: "User found with service client",
        data: userData,
      };
    } catch (error: any) {
      console.error("Service client unexpected error:", error);
      return {
        status: false,
        message: `Service client error: ${error.message || "Unknown error"}`,
        error: "SERVICE_CLIENT_ERROR",
      };
    }
  }
}
