addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  const url = new URL(request.url)
  const PATH = "/ed=2048"  // pastikan sesuai config xray
  const ORIGIN_HOST = "202.155.91.127" // bisa IP publik / domain origin
  const ORIGIN_PORT = "10000"

  // hanya proxy WS pada path tertentu
  if (request.headers.get("Upgrade") && request.headers.get("Upgrade").toLowerCase() === "websocket" && url.pathname === PATH) {
    // buat pair web socket untuk client
    const webSocketPair = new WebSocketPair()
    const clientSocket = webSocketPair[0]
    const serverSocket = webSocketPair[1]

    // accept untuk socket server (di sisi worker)
    serverSocket.accept()

    // fetch ke origin dengan opsi websocket
    const originUrl = `https://${ORIGIN_HOST}:${ORIGIN_PORT}${PATH}`
    const upstreamResponse = await fetch(originUrl, {
      method: 'GET',
      headers: request.headers,
      cf: { websocket: true }
    })

    // dapatkan webSocket dari upstream response
    const upstreamSocket = upstreamResponse.webSocket

    // pastikan upstream juga diterima
    upstreamSocket.accept()

    // pipe dari upstream -> client
    upstreamSocket.addEventListener('message', evt => {
      try { serverSocket.send(evt.data) } catch (e) { /* ignore */ }
    })
    // pipe dari client -> upstream
    serverSocket.addEventListener('message', evt => {
      try { upstreamSocket.send(evt.data) } catch (e) { /* ignore */ }
    })

    // close handling
    serverSocket.addEventListener('close', () => {
      try { upstreamSocket.close() } catch (e) {}
    })
    upstreamSocket.addEventListener('close', () => {
      try { serverSocket.close() } catch (e) {}
    })

    // return Switching Protocols dengan client socket
    return new Response(null, { status: 101, webSocket: clientSocket })
  }

  // fallback: pass-through untuk HTTP(s)
  return fetch(request)
}
