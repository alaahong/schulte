// 简单的静态文件服务器,用于截图测试
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const ROOT = process.argv[2] || 'd:\\task\\code\\schulte\\dist'
const PORT = Number(process.argv[3] || 8765)
const HOST = '127.0.0.1'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.webmanifest': 'application/manifest+json'
}

async function tryFile(p) {
  try { const s = await stat(p); if (s.isFile()) return p } catch {}
  return null
}

const server = createServer(async (req, res) => {
  try {
    let url = decodeURIComponent((req.url || '/').split('?')[0])
    if (url === '/') url = '/index.html'
    const safe = normalize(join(ROOT, url))
    if (!safe.startsWith(normalize(ROOT))) { res.writeHead(403); res.end('forbidden'); return }
    let p = await tryFile(safe)
    if (!p) p = await tryFile(join(safe, 'index.html'))
    // SPA 路由兜底:非资源类(无扩展名)路径都返回 index.html
    if (!p && !extname(safe)) p = await tryFile(join(ROOT, 'index.html'))
    if (!p) { res.writeHead(404); res.end('not found: ' + url); return }
    const buf = await readFile(p)
    const ext = extname(p).toLowerCase()
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': 'no-store' })
    res.end(buf)
  } catch (e) {
    res.writeHead(500); res.end(String(e))
  }
})

server.listen(PORT, HOST, () => {
  console.log(`static server: http://${HOST}:${PORT}`)
  console.log(`serving: ${ROOT}`)
})
