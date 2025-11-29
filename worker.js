export default {
  async fetch(request) {
    const upgradeHeader = request.headers.get('Upgrade');
    
    if (upgradeHeader === 'websocket') {
      const url = new URL(request.url);
      
      // Modify the request to point to your Xray server
      const modifiedRequest = new Request(`http://202.155.91.127:10000/ed=2048`, {
        headers: request.headers,
        method: request.method,
        body: request.body
      });
      
      return fetch(modifiedRequest);
    }
    
    return new Response("Xray Worker - WebSocket only");
  }
}
