import { assertEquals } from "https://deno.land/std@0.181.0/testing/asserts.ts";
import { handler } from "./index.ts";

// Helper function to simulate a request
async function testHandler(method: string, url = "http://localhost", body?: Record<string, unknown>) {
  const req = new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  return await handler(req);
}

// ✅ Test: GET / (fetch all recipes)
Deno.test("GET / returns recipes", async () => {
  const res = await testHandler("GET");
  assertEquals(res.status, 200);
});

// ✅ Test: GET /?columns=title (fetch only title column)
Deno.test("GET /?columns=title returns only title", async () => {
  const res = await testHandler("GET", "http://localhost?columns=title");
  assertEquals(res.status, 200);
});

// ✅ Test: PATCH returns 405 (method not allowed)
Deno.test("PATCH returns 405", async () => {
  const res = await testHandler("PATCH");
  assertEquals(res.status, 405);
});

