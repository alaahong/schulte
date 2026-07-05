/**
 * 从 SVG 生成 Tauri 需要的各种平台图标
 * 用法: node scripts/generate-tauri-icons.mjs
 *
 * 产物 (写入 src-tauri/icons/):
 *   32x32.png
 *   128x128.png
 *   128x128@2x.png  (= 256x256)
 *   icon.ico        (Windows 多尺寸)
 *   icon.icns       (macOS 多尺寸)
 *   Square*.png     (Windows Store 风格)
 */
import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const srcSvg = join(root, 'public', 'pwa-512x512.svg')
const outDir = join(root, 'src-tauri', 'icons')

if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

const svg = await readFile(srcSvg)

async function renderPng(size, padding = 0) {
  const inner = Math.round(size * (1 - padding * 2))
  if (padding === 0) {
    return sharp(svg).resize(size, size, { fit: 'contain', background: { r: 14, g: 165, b: 233, alpha: 1 } }).png().toBuffer()
  }
  const innerBuf = await sharp(svg).resize(inner, inner).png().toBuffer()
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 14, g: 165, b: 233, alpha: 1 } }
  }).composite([{ input: innerBuf, top: Math.round((size - inner) / 2), left: Math.round((size - inner) / 2) }]).png().toBuffer()
}

const sizes = {
  '32x32.png': 32,
  '128x128.png': 128,
  '128x128@2x.png': 256,
  'icon.png': 512
}

for (const [name, size] of Object.entries(sizes)) {
  const buf = await renderPng(size)
  await writeFile(join(outDir, name), buf)
  console.log(`✓ ${name} (${size}x${size})`)
}

// Windows ICO (multi-size: 16, 32, 48, 64, 128, 256)
const icoSizes = [16, 32, 48, 64, 128, 256]
const icoImages = await Promise.all(icoSizes.map((s) => renderPng(s)))
// 构造 ICO 容器(每张 PNG 内嵌为 ICO 资源)
const icoHeader = Buffer.from([0, 0, 1, 0, icoSizes.length])
let icoOffset = 6 + 16 * icoSizes.length
const dirEntries = []
const pngBlocks = []
for (let i = 0; i < icoSizes.length; i++) {
  const size = icoSizes[i]
  const buf = icoImages[i]
  // 宽高字段:0 表示 256
  const w = size >= 256 ? 0 : size
  const h = size >= 256 ? 0 : size
  dirEntries.push(Buffer.from([w, h, 0, 0, 1, 0, 32, 0]))
  dirEntries.push(uint32LE(buf.length))
  dirEntries.push(uint32LE(icoOffset))
  icoOffset += buf.length
  pngBlocks.push(buf)
}
const ico = Buffer.concat([icoHeader, ...dirEntries, ...pngBlocks])
await writeFile(join(outDir, 'icon.ico'), ico)
console.log(`✓ icon.ico (${icoSizes.join(', ')})`)

// Apple ICNS(多尺寸 PNG 容器)
const icnsSizes = [16, 32, 64, 128, 256, 512]
const icnsTypeMap = {
  16: 'icp4', 32: 'icp5', 64: 'icp6',
  128: 'ic07', 256: 'ic08', 512: 'ic09'
}
const icnsChunks = []
for (const s of icnsSizes) {
  const buf = await renderPng(s)
  const type = icnsTypeMap[s]
  const len = 8 + buf.length
  icnsChunks.push(Buffer.from(type, 'ascii'))
  icnsChunks.push(uint32BE(len))
  icnsChunks.push(buf)
}
const icnsBody = Buffer.concat(icnsChunks)
const icns = Buffer.concat([
  Buffer.from('icns', 'ascii'),
  uint32BE(8 + icnsBody.length),
  icnsBody
])
await writeFile(join(outDir, 'icon.icns'), icns)
console.log(`✓ icon.icns (${icnsSizes.join(', ')})`)

// Windows Store 风格图标(可选,Tauri 2 bundle 接受)
const sqSizes = ['30x30', '44x44', '71x71', '89x89', '107x107', '142x142', '150x150', '284x284', '310x310', '50x50']
for (const label of sqSizes) {
  const size = parseInt(label.split('x')[0])
  const buf = await renderPng(size)
  const name = `Square${label}Logo.png`
  await writeFile(join(outDir, name), buf)
}
console.log(`✓ Square*Logo.png (${sqSizes.length} sizes)`)

console.log('Done.')

function uint32LE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32LE(n, 0)
  return b
}
function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n, 0)
  return b
}
