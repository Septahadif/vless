const SERVER_IP = '202.155.91.127';
const SERVER_PORT = '10000';
const WS_PATH = '/ed=2048';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle WebSocket connections to the specific path
    if (url.pathname === WS_PATH && request.headers.get('Upgrade') === 'websocket') {
      console.log('WebSocket upgrade request for VLess');
      
      // Forward to Xray server with proper WebSocket headers
      const modifiedHeaders = new Headers(request.headers);
      modifiedHeaders.set('Host', 'vless.masjawa.my.id');
      
      try {
        const response = await fetch(`http://${SERVER_IP}:${SERVER_PORT}${WS_PATH}`, {
          headers: modifiedHeaders,
          method: request.method,
          body: request.body
        });
        
        console.log('Xray response status:', response.status);
        return response;
        
      } catch (error) {
        console.log('Forwarding error:', error.message);
        return new Response('WebSocket forwarding failed', { status: 502 });
      }
    }
    
    // For non-WebSocket requests, show info
    return new Response('Xray VLess Worker\n\nUse WebSocket path: /ed=2048', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
