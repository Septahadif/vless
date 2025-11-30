// ==========================
// VLESS WS via CF Worker TCP Relay
// 100% kompatibel Xray/XTLS 2025
// ==========================

// GANTI ini:
const UPSTREAM = "202.155.91.127";    // IP VPS kamu
const UP_PORT  = 10000;               // port Xray WS server
const UP_PATH  = "/wss";              // path websocket Xray

export default {
  async fetch(request, env, ctx) {

    // Hanya izinkan WebSocket-RAW masuk dari VLESS
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
      return new Response("Waiting VLESS WebSocket", { status: 426 });
    }

    // Membuat pasangan WebSocket
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    server.accept();

    // Membuka koneksi: Worker → VPS (raw TCP stream)
    const tcpSocket = await connect(UPSTREAM, UP_PORT, {
      allowHalfOpen: true,
      secureTransport: false
    });

    // Relay data: client <→ server
    tcpSocket.readable.pipeTo(
      new WritableStream({
        write(chunk) {
          server.send(chunk);
        },
        close() {
          server.close();
        }
      })
    );

    server.addEventListener("message", (e) => {
      if (typeof e.data === "string") return;
      tcpSocket.writable.getWriter().write(e.data);
    });

    server.addEventListener("close", () => tcpSocket.close());
    server.addEventListener("error", () => tcpSocket.close());

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }
};

/**
 * Membuat koneksi TCP mentah dari Worker → VPS
 */
async function connect(address, port, options) {
  return await globalThis.connect(address, port, options);
      }
