export default {
  async fetch(request) {
    const targetUrl = new URL(request.url);
    const destination = targetUrl.searchParams.get('url');
    
    if (!destination) {
      return new Response('Add ?url= parameter', { status: 400 });
    }
    
    // Gunakan Squid sebagai forward proxy untuk HTTP
    const squidResponse = await fetch(`https://netflix.com:443`, {
      headers: {
        'X-Target-URL': destination
      }
    });
    
    return squidResponse;
  }
}
