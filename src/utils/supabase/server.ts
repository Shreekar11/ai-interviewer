export function createServiceClient() {
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
}