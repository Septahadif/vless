export default {
  async fetch(request) {
    const targetUrl = new URL(request.url);
    const destination = targetUrl.searchParams.get('url');
    
    if (!destination) {
      return new Response('Add ?url= parameter', { status: 400 });
    }
    
    // Gunakan Squid sebagai forward proxy untuk HTTP
    const squidResponse = await fetch(`http://202.155.91.127:3128`, {
      headers: {
        'X-Target-URL': destination
      }
    });
    
    return squidResponse;
  }
}
