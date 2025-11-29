export default {
  async fetch(request) {
    const url = new URL(request.url);

    const PATH = "/ed=2048";
    const ORIGIN = "http://202.155.91.127:10000";

    // Jika ini WebSocket upgrade & path cocok
    if (
      request.headers.get("Upgrade")?.toLowerCase() === "websocket" &&
      url.pathname === PATH
    ) {
      return await fetch(ORIGIN + PATH, {
        headers: request.headers,
        method: request.method,
        body: request.body,
        cf: { websocket: true },
      });
    }

    // Fallback HTTP
    return new Response("OK VLESS WS WORKER", { status: 200 });
  },
};
