const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=").map((s) => s.trim()))
    .filter(([k]) => k)
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { error: dbError } = await supabase.from("photos").select("id").limit(1);
  console.log("DB:", dbError ? `ERROR: ${dbError.message}` : "OK");

  const { error: storageError } = await supabase.storage
    .from("wedding-photos")
    .list("", { limit: 1 });
  console.log("Storage:", storageError ? `ERROR: ${storageError.message}` : "OK");
}

test().catch((e) => console.error(e.message));
