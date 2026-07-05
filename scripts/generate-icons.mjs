/**
 * 从 SVG 生成 PWA 各种尺寸 PNG
 * 用法: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const publicDir = join(root, 'public')
const distDir = join(root, 'dist')

const source = join(publicDir, 'pwa-512x512.svg')
const sourceBuf = await readFile(source)

const targets = [
  { name: 'pwa-192x192.png',          size: 192, maskable: false },
  { name: 'pwa-512x512.png',          size: 512, maskable: false },
  { name: 'pwa-512x512-maskable.png', size: 512, maskable: true,  padding: 0.1 },
  { name: 'apple-touch-icon.png',     size: 180, maskable: false }
]

if (!existsSync(publicDir)) await mkdir(publicDir, { recursive: true })
if (!existsSync(distDir))   await mkdir(distDir,   { recursive: true })

for (const t of targets) {
  let img = sharp(sourceBuf).resize(t.size, t.size, { fit: 'contain', background: { r: 14, g: 165, b: 233, alpha: 1 } })
  if (t.maskable) {
    // maskable: 在安全区内显示主图形,留 10% padding
    const inner = Math.round(t.size * (1 - (t.padding || 0.1) * 2))
    const composite = await sharp(sourceBuf)
      .resize(inner, inner, { fit: 'contain', background: { r: 14, g: 165, b: 233, alpha: 1 } })
      .png()
      .toBuffer()
    img = sharp({
      create: { width: t.size, height: t.size, channels: 4, background: { r: 14, g: 165, b: 233, alpha: 1 } }
    }).composite([{ input: composite, top: Math.round((t.size - inner) / 2), left: Math.round((t.size - inner) / 2) }])
  }
  const buf = await img.png().toBuffer()
  await writeFile(join(publicDir, t.name), buf)
  await writeFile(join(distDir, t.name), buf)
  console.log(`✓ ${t.name} (${t.size}x${t.size}${t.maskable ? ', maskable' : ''})`)
}

console.log('Done.')
