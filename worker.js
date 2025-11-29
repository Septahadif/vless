const SERVER_IP = '202.155.91.127';
const SERVER_PORT = '10000';
const WS_PATH = '/ed=2048';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Cloudflare: upgrade check
    if (
      url.pathname === WS_PATH &&
      request.headers.get("Upgrade")?.toLowerCase() === "websocket"
    ) {
      // Forward WebSocket to origin Xray
      return fetch(`http://${SERVER_IP}:${SERVER_PORT}${WS_PATH}`, {
        headers: request.headers,
        method: request.method,
        body: request.body,
        cf: { websocket: true },
      });
    }

    return new Response("OK: VLESS WS Worker active\nPath: /ed=2048");
  }
}
