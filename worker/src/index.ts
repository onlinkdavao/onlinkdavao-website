const CACHE_KEY = "https://cache.internal/sheets-events-csv";

const ALLOWED_ORIGINS = ["https://onlinkdavao.org"];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin));

  return {
    "Access-Control-Allow-Origin": allowed ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

interface Env {
  SHEETS_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const cache = caches.default;
    const cacheRequest = new Request(CACHE_KEY);

    const cached = await cache.match(cacheRequest);
    if (cached) {
      const res = new Response(cached.body, cached);
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    const upstream = await fetch(env.SHEETS_URL);
    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status}`, {
        status: 502,
        headers: corsHeaders(origin),
      });
    }

    const text = await upstream.text();

    const toCache = new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
    await cache.put(cacheRequest, toCache.clone());

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        ...corsHeaders(origin),
      },
    });
  },
};
