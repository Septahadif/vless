const target_host = 'vless.masjawa.my.id';
const target_port = '10000';
const target_path = '/ed=2048';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headers = new Headers(request.headers);
    
    // Modify headers for WebSocket
    headers.set('Host', target_host);
    headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP'));
    headers.set('X-Real-IP', request.headers.get('CF-Connecting-IP'));
    
    // WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      const wsUrl = `https://${target_host}:${target_port}${target_path}`;
      
      return await fetch(wsUrl, {
        headers: headers,
        method: request.method,
        body: request.body
      });
    }
    
    return new Response('VLess WS Worker Active', { status: 200 });
  }
};
