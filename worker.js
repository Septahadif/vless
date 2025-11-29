// =============  workers-vless-relay  =============
// Ganti HOST_IP, HOST_PORT, HOST_PATH, dan UUID di bawah
const HOST_IP   = '202.155.91.127';     // IP VPS / rumah kamu
const HOST_PORT = '80';           // port Xray di atas
const HOST_PATH = '/wss';          // path wsSettings di Xray
const UUID      = 'b831381d-6324-4d53-ad4f-8cda48b30811';     // sama persis dengan server

function isVlessHeader(buffer) {   // cek UUID
  return buffer.length >= 17 &&
    Array.from(buffer.slice(1, 17)).map(b => b.toString(16).padStart(2,'0')).join('') ===
    UUID.replace(/-/g,'');
}

export default {
  async fetch(req, env, ctx) {
    const upgrade = req.headers.get('Upgrade') || '';
    const url     = new URL(req.url);

    // Validasi quick: hanya terima WebSocket & path benar
    if (upgrade.toLowerCase() !== 'websocket' || url.pathname !== HOST_PATH) {
      return new Response('Expected WebSocket', { status: 426 });
    }

    // 1. Buat pasangan WebSocket
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();

    // 2. Bungkus koneksi asli ke Xray
    const remote = await fetch(`http://${HOST_IP}:${HOST_PORT}${HOST_PATH}`, {
      headers: {
        Upgrade: 'websocket',
        Connection: 'Upgrade',
        'Sec-WebSocket-Key': req.headers.get('Sec-WebSocket-Key'),
        'Sec-WebSocket-Version': req.headers.get('Sec-WebSocket-Version'),
        'Sec-WebSocket-Extensions': req.headers.get('Sec-WebSocket-Extensions') || '',
        'X-Forwarded-For': req.headers.get('CF-Connecting-IP') || ''
      }
    });

    if (remote.status !== 101) {
      server.close(1011, 'Upstream error');
      return new Response(null, { status: 502 });
    }

    const upstream = remote.webSocket;
    upstream.accept();

    // 3. Relay dua arah
    const relay = (from, to) => {
      from.addEventListener('message', e => to.send(e.data));
      from.addEventListener('close',   () => to.close());
      from.addEventListener('error',   () => to.close());
    };
    relay(server, upstream);
    relay(upstream, server);

    return new Response(null, { status: 101, webSocket: client });
  }
};
