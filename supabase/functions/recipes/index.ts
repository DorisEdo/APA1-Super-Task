import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req: Request) => {
  const headers = { "Content-Type": "application/json" };

  try {
    // Fetch all recipes (GET)
    if (req.method === "GET") {
      let { data: recipes, error } = await supabase
        .from("recipes")
        .select("*");

      if (error) throw error;
      return new Response(JSON.stringify(recipes), { headers });
    }

    // Fetch specific recipe columns (GET with Query Params)
    if (req.method === "GET" && req.url.includes("?columns=")) {
      const queryParams = new URL(req.url).searchParams;
      const columns = queryParams.get("columns") || "*"; // Defaults to all columns

      let { data: recipes, error } = await supabase
        .from("recipes")
        .select(columns);

      if (error) throw error;
      return new Response(JSON.stringify(recipes), { headers });
    }

    // Insert a new recipe (POST)
    if (req.method === "POST") {
      const { title, ingredients, instructions, category, image_url } = await req.json();

      const { data, error } = await supabase
        .from("recipes")
        .insert([{ title, ingredients, instructions, category, image_url }])
        .select(); // Returns inserted row

      if (error) throw error;
      return new Response(JSON.stringify(data), { headers });
    }

    // Update an existing recipe (PUT)
    if (req.method === "PUT") {
      const { id, title, ingredients, instructions, category, image_url } = await req.json();
    
      const { data, error } = await supabase
        .from("recipes")
        .update({
          title,
          ingredients,
          instructions,
          category,
          image_url
        })
        .eq("id", id)
        .select();
    
      if (error) throw error;
    
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Delete a recipe by ID (DELETE)
    if (req.method === "DELETE") {
      const { id } = await req.json();

      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: "Recipe deleted!" }), { headers });
    }

    // Subscribe to real-time recipe changes (for the frontend)
    if (req.method === "GET" && req.url.includes("subscribe")) {
      const recipes = supabase.channel("recipes-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "recipes" },
          (payload) => {
            console.log("Change received!", payload);
          }
        )
        .subscribe();

      return new Response(JSON.stringify({ success: true, message: "Subscribed to recipe updates!" }), { headers });
    }

    // Handle unsupported methods
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/recipes' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
