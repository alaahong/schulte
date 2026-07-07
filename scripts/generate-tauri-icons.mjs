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
// IMPORTANT: rc.exe (Windows Resource Compiler) does NOT support PNG-in-ICO format.
// It only supports BMP (DIB) entries. We must convert each image to BMP format:
//   BITMAPINFOHEADER (40 bytes) + pixel data (32-bit BGRA, bottom-up) + AND mask
const icoSizes = [16, 32, 48, 64, 128, 256]
const icoBmpBlocks = []
for (const size of icoSizes) {
  const pngBuf = await renderPng(size)
  const { data, info } = await sharp(pngBuf).raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height
  // BITMAPINFOHEADER (40 bytes)
  const bih = Buffer.alloc(40)
  bih.writeUInt32LE(40, 0)          // biSize
  bih.writeInt32LE(w, 4)            // biWidth
  bih.writeInt32LE(h * 2, 8)        // biHeight (doubled for ICO: image + mask)
  bih.writeUInt16LE(1, 12)          // biPlanes
  bih.writeUInt16LE(32, 14)         // biBitCount
  bih.writeUInt32LE(0, 16)          // biCompression (BI_RGB)
  bih.writeUInt32LE(0, 20)          // biSizeImage
  bih.writeInt32LE(0, 24)           // biXPelsPerMeter
  bih.writeInt32LE(0, 28)           // biYPelsPerMeter
  bih.writeUInt32LE(0, 32)          // biClrUsed
  bih.writeUInt32LE(0, 36)          // biClrImportant

  // Pixel data: RGBA -> BGRA, and flip vertically (BMP is bottom-up)
  const pixels = Buffer.alloc(w * h * 4)
  for (let y = 0; y < h; y++) {
    const srcRow = (h - 1 - y) * w * 4
    const dstRow = y * w * 4
    for (let x = 0; x < w; x++) {
      const si = srcRow + x * 4
      const di = dstRow + x * 4
      pixels[di] = data[si + 2]     // B
      pixels[di + 1] = data[si + 1] // G
      pixels[di + 2] = data[si]     // R
      pixels[di + 3] = data[si + 3] // A
    }
  }

  // AND mask: 1 bit per pixel, padded to 4-byte boundaries, all 0 (opaque)
  const maskRowSize = Math.ceil(w / 8 / 4) * 4
  const mask = Buffer.alloc(maskRowSize * h, 0)

  icoBmpBlocks.push(Buffer.concat([bih, pixels, mask]))
}

// ICO header: 6 bytes + 16 bytes per entry
const icoHeader = Buffer.alloc(6)
icoHeader.writeUInt16LE(0, 0)       // reserved
icoHeader.writeUInt16LE(1, 2)       // type (1 = ICO)
icoHeader.writeUInt16LE(icoSizes.length, 4) // count

let icoOffset = 6 + 16 * icoSizes.length
const dirEntries = []
for (let i = 0; i < icoSizes.length; i++) {
  const size = icoSizes[i]
  const buf = icoBmpBlocks[i]
  const w = size >= 256 ? 0 : size
  const h = size >= 256 ? 0 : size
  const entry = Buffer.alloc(16)
  entry.writeUInt8(w, 0)            // width
  entry.writeUInt8(h, 1)            // height
  entry.writeUInt8(0, 2)            // color count
  entry.writeUInt8(0, 3)            // reserved
  entry.writeUInt16LE(1, 4)         // planes
  entry.writeUInt16LE(32, 6)        // bit count
  entry.writeUInt32LE(buf.length, 8) // size
  entry.writeUInt32LE(icoOffset, 12) // offset
  dirEntries.push(entry)
  icoOffset += buf.length
}
const ico = Buffer.concat([icoHeader, ...dirEntries, ...icoBmpBlocks])
await writeFile(join(outDir, 'icon.ico'), ico)
console.log(`✓ icon.ico (${icoSizes.join(', ')}) [BMP format]`)

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
