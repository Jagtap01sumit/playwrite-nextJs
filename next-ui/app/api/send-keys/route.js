// app/api/send-keys/route.js

export async function POST(req) {
  try {
    const { keyword, url } = await req.json();

    if (!keyword && !url) {
      return new Response(
        JSON.stringify({ error: "Keyword or URL is required" }),
        {
          status: 400,
        }
      );
    }

    const payload = keyword ? { keyword } : { url };
    const targetEndpoint = keyword
      ? "http://localhost:5000/search"
      : "http://localhost:5000/check";

    console.log("Forwarding to Python:", payload);

    const response = await fetch(targetEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error("Error in /api/send-keys:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500 }
    );
  }
}
