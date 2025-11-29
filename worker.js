const SERVER_IP = '202.155.91.127';
const SERVER_PORT = '10000';
const WS_PATH = '/ed=2048';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Only handle WebSocket connections
    if (url.pathname === WS_PATH && request.headers.get('Upgrade') === 'websocket') {
      // Create new headers for the upstream request
      const upstreamHeaders = new Headers();
      upstreamHeaders.set('Host', 'vless.masjawa.my.id');
      upstreamHeaders.set('Upgrade', 'websocket');
      upstreamHeaders.set('Connection', 'Upgrade');
      upstreamHeaders.set('Sec-WebSocket-Version', request.headers.get('Sec-WebSocket-Version') || '13');
      upstreamHeaders.set('Sec-WebSocket-Key', request.headers.get('Sec-WebSocket-Key') || '');
      
      // Forward the WebSocket request
      const upstreamResponse = await fetch(`http://${SERVER_IP}:${SERVER_PORT}${WS_PATH}`, {
        headers: upstreamHeaders,
        method: 'GET'
      });
      
      return upstreamResponse;
    }
    
    // Return simple response for normal HTTP
    return new Response('Xray Worker - Use WebSocket for VLess', { status: 200 });
  }
}
