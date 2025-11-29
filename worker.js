export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.headers.get('Upgrade') === 'websocket') {
      return await fetch(`http://202.155.91.127:10000/ed=2048`, {
        headers: request.headers,
        method: request.method,
        body: request.body
      });
    }
    
    return new Response('Xray Worker Ready');
  }
}
