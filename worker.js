const SERVER_IP = '202.155.91.127'; // IP server Anda
const SERVER_PORT = '10000';
const WS_PATH = '/ed=2048';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    console.log('Incoming request:', request.method, url.pathname);
    
    // Handle WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      console.log('WebSocket upgrade request detected');
      
      // Forward to Xray server
      const targetUrl = `http://${SERVER_IP}:${SERVER_PORT}${WS_PATH}`;
      console.log('Forwarding to:', targetUrl);
      
      const modifiedHeaders = new Headers(request.headers);
      modifiedHeaders.set('Host', 'vless.masjawa.my.id');
      
      try {
        const response = await fetch(targetUrl, {
          headers: modifiedHeaders,
          method: request.method,
          body: request.body
        });
        
        console.log('Xray server response status:', response.status);
        return response;
        
      } catch (error) {
        console.log('Error forwarding to Xray:', error.message);
        return new Response('Error connecting to Xray server', { status: 502 });
      }
    }
    
    // Normal HTTP response
    return new Response('🚀 Xray VLess Worker Active\n\n• WebSocket Path: /ed=2048\n• Status: Ready to forward connections', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
