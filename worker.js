export default {
  async fetch(request) {
    // Test if worker can reach your server
    try {
      const testResponse = await fetch(`http://202.155.91.127:10000/`, {
        method: 'HEAD',
        timeout: 5000
      });
      
      return new Response(`Server reachable: ${testResponse.status} - Use WebSocket path /ed=2048`);
    } catch (error) {
      return new Response(`Cannot reach server: ${error.message}`, { status: 502 });
    }
  }
}
