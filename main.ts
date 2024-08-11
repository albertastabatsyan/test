import { Hono } from "https://deno.land/x/hono@v2.7.3/mod.ts";

const app = new Hono();

// Configuration
const BUBBLE_API_KEY = "YOUR_BUBBLE_API_KEY"; // Replace with your actual Bubble API key
const BUBBLE_APP_DOMAIN = "d243.bubble.is/site/ai-finetune";
const ENV = "5idf";

app.all("/v2_voice_agents_test", async (c) => {
  const apiKey = BUBBLE_API_KEY;

  const url = new URL(`https://${BUBBLE_APP_DOMAIN}/version-${ENV}/api/1.1/wf/v2_voice_agents_test`);
  
  // Add any query parameters from the request
  for (const [key, value] of Object.entries(c.req.query())) {
    url.searchParams.set(key, value);
  }
  
  url.searchParams.set("api_key", apiKey);

  console.log('calling', url)

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: c.req.body ? JSON.stringify(await c.req.json()) : undefined,
    });

    if (!response.ok) {
      return c.json({ error: `Bubble API request failed with status code ${response.status}` }, response.status);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch)