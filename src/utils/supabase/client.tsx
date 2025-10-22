import { createClient as createSupabaseClient } from "jsr:@supabase/supabase-js@2";
import { projectId, publicAnonKey } from "./info";

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return supabaseClient;
}

export const supabase = createClient();
