import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Exported handler for tests and server
const handler = async (req: Request): Promise<Response> => {
  const headers = { "Content-Type": "application/json" };

  try {
    const url = new URL(req.url);

    // Subscribe to changes (optional for frontend)
    if (req.method === "GET" && url.pathname.includes("subscribe")) {
      supabase.channel("recipes-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "recipes" },
          (payload) => console.log("Change received!", payload)
        )
        .subscribe();

      return new Response(JSON.stringify({ success: true, message: "Subscribed!" }), { headers });
    }

    // GET with specific columns
    if (req.method === "GET" && url.searchParams.has("columns")) {
      const columns = url.searchParams.get("columns") || "*";
      const { data, error } = await supabase.from("recipes").select(columns);
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // GET all recipes
    if (req.method === "GET") {
      const { data, error } = await supabase.from("recipes").select("*");
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // POST - Create new recipe
    if (req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabase.from("recipes").insert([body]).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // PUT - Update existing recipe
    if (req.method === "PUT") {
      const { id, ...fields } = await req.json();
      const { data, error } = await supabase.from("recipes").update(fields).eq("id", id).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // DELETE - Remove recipe by ID
    if (req.method === "DELETE") {
      const { id } = await req.json();
      const { error } = await supabase.from("recipes").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Recipe deleted!" }), { headers });
    }

    // Unsupported method
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errMessage }), { status: 500, headers });
  }
};

serve(handler);
export { handler };



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/recipes' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
