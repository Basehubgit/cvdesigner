import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://vivvzwfzjxtnelhkymzz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpdnZ6d2Z6anh0bmVsaGt5bXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDczMDAsImV4cCI6MjA5NDQyMzMwMH0.-lXpjRaOJjc_ecBoFnm6dNKYNjZAt8FnH84xGkMurWw"
);
