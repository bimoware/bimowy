import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"
<<<<<<< Updated upstream:src/db/server.ts
=======

dotenv.config()
>>>>>>> Stashed changes:src/lib/supabase/server.ts

dotenv.config()

export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
