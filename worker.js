addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Ganti dengan domain server asli Anda
  const originUrl = 'https://id.masjawa.my.id'
  
  // Untuk path WebSocket SSH/VLES
  if (url.pathname.includes('/ssh') || url.pathname.includes('/vless')) {
    const targetUrl = originUrl + url.pathname + url.search
    
    return fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
  }
  
  return new Response('Not found', { status: 404 })
}
