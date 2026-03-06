export const RAW_BASE = 'https://raw.githubusercontent.com/aravindtm/my-blogs/main'

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data = {}
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':')
    if (key && key.trim()) {
      data[key.trim()] = rest.join(':').trim().replace(/^\[|\]$/g, '')
    }
  })
  return { data, content: match[2] }
}

export function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function resolveImageUrl(slug, src) {
  if (!src) return src
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  const filename = src.replace(/^\.\//, '')
  return `${RAW_BASE}/posts/${slug}/${filename}`
}
