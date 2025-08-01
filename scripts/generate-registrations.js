// scripts/generate-registrations.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Emulate __dirname in ESM:
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const root = path.resolve(__dirname, '../src')
// … rest of your script unchanged …

// helper to walk directories
function walk(dir, ext, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) {
      walk(full, ext, files)
    }
    else if (full.endsWith(ext)) {
      files.push(full)
    }
  }
  return files
}

// 1) Components
const comps = walk(path.join(root, 'components'), '.vue')
// 2) Services
const svcs  = walk(path.join(root, 'services'),  '.js')
// 3) Pages
const pages = walk(path.join(root, 'pages'),     '.vue')

// Build import lines & registrations
let out = []

out.push(`// AUTO GENERATED - do not edit by hand\n`)

out.push('// => importing ENDPOINTS:')
out.push(`import ENDPOINTS from './ENDPOINTS.js'\n`)

out.push('// => importing services:')
svcs.forEach(file => {
  const rel = './' + path.relative(root, file).replace(/\\/g, '/')
  const name = path.basename(file, '.js')
  out.push(`import ${name} from '${rel}'`)
})

out.push('\n// => importing components:')
comps.forEach(file => {
  const rel = './' + path.relative(root, file).replace(/\\/g, '/')
  const name = path.basename(file, '.vue')
  out.push(`import ${name} from '${rel}'`)
})

out.push('\nexport function registerEndpoints(app) {')
out.push('  app.config.globalProperties.$iam.ENDPOINTS = ENDPOINTS')
out.push('}\n')

out.push('export function registerComponents(app) {')
comps.forEach(file => {
  const name = path.basename(file, '.vue')
  out.push(`  app.component('${name}', ${name})`)
})
out.push('}\n')

out.push('export function registerServices(app) {')
svcs.forEach(file => {
  const rel = './' + path.relative(root, file).replace(/\\/g, '/')
  const name = path.basename(file, '.js')
  out.push(`  app.config.globalProperties.$iam.services['${name}'] = ${name}`)
})
out.push('}\n')

// Pages
out.push('export const pages = {}')
pages.forEach(file => {
  const rel = './' + path.relative(root, file).replace(/\\/g, '/')
  const name = path.basename(file, '.vue')
  out.push(`pages['${name}'] = (await import('${rel}')).default`)
})

// Write the file
fs.writeFileSync(
  path.join(root, 'registrations.js'),
  out.join('\n'),
  'utf-8'
)

console.log('registrations.js generated.')
