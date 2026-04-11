import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const svg = readFileSync(resolve(root, 'src/app/icon.svg'))

const sizes = [
  { size: 192, output: 'public/icons/icon-192x192.png' },
  { size: 512, output: 'public/icons/icon-512x512.png' },
  { size: 180, output: 'public/icons/apple-touch-icon.png' },
]

for (const { size, output } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(root, output))
  console.log(`Generated ${output} (${size}x${size})`)
}

console.log('Done!')
