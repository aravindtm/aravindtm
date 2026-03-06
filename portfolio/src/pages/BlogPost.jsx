import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Giscus from '@giscus/react'
import AnimatedSection from '../components/AnimatedSection'
import { RAW_BASE, parseFrontmatter, estimateReadingTime, resolveImageUrl } from '../utils/blogUtils'

const GISCUS_REPO = 'aravindtm/my-blogs'
const GISCUS_REPO_ID = 'YOUR-REPO-ID'
const GISCUS_CATEGORY = 'Announcements'
const GISCUS_CATEGORY_ID = 'YOUR-CATEGORY-ID'

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

// Recursively extract plain text from React children (handles nested elements)
function childrenToText(children) {
  if (children == null) return ''
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(childrenToText).join('')
  if (children?.props?.children) return childrenToText(children.props.children)
  return ''
}

function extractHeadings(markdown) {
  const lines = markdown.split('\n')
  return lines
    .filter(l => /^#{2,3}\s/.test(l))
    .map(l => {
      const level = l.match(/^(#{2,3})/)[1].length
      const text = l.replace(/^#{2,3}\s+/, '').replace(/\*\*|__|\*|_|`/g, '')
      const id = slugify(text)
      return { level, text, id }
    })
}

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const [raw, setRaw] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeHeading, setActiveHeading] = useState(null)
  const articleRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetch(`${RAW_BASE}/posts/${slug}/index.md`)
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.text()
      })
      .then(text => setRaw(text))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      setScrollProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [loading])

  // Active heading via IntersectionObserver
  useEffect(() => {
    if (loading) return
    const headingEls = document.querySelectorAll('article h2, article h3')
    if (!headingEls.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveHeading(entry.target.id)
        })
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )
    headingEls.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [loading, raw])

  const scrollToHeading = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const { data: frontmatter, content } = useMemo(() => {
    if (!raw) return { data: {}, content: '' }
    return parseFrontmatter(raw)
  }, [raw])

  const headings = useMemo(() => content ? extractHeadings(content) : [], [content])
  const readingTime = useMemo(() => content ? estimateReadingTime(content) : 0, [content])

  const components = useMemo(() => ({
    img({ src, alt, ...props }) {
      return <img src={resolveImageUrl(slug, src)} alt={alt} {...props} className="rounded-xl max-w-full my-6 shadow-lg" />
    },
    h2({ children, ...props }) {
      const id = slugify(childrenToText(children))
      return <h2 id={id} {...props}>{children}</h2>
    },
    h3({ children, ...props }) {
      const id = slugify(childrenToText(children))
      return <h3 id={id} {...props}>{children}</h3>
    },
    pre({ children, ...props }) {
      const codeEl = children?.props
      const code = codeEl?.children || ''
      const lang = codeEl?.className?.replace('language-', '') || ''
      return (
        <div className="relative group my-6">
          {lang && (
            <span className="absolute top-3 left-4 text-xs font-mono text-gray-400 select-none">{lang}</span>
          )}
          <CopyButton code={String(code).trimEnd()} />
          <pre {...props} className={`${lang ? 'pt-9' : ''} bg-gray-950 text-gray-100 rounded-xl overflow-x-auto p-4 text-sm`}>
            {children}
          </pre>
        </div>
      )
    },
    code({ inline, className, children, ...props }) {
      if (inline) {
        return <code className="bg-gray-100 dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
      }
      return <code className={className} {...props}>{children}</code>
    },
  }), [slug])

  const tagList = frontmatter.tags
    ? (typeof frontmatter.tags === 'string'
        ? frontmatter.tags.split(',').map(t => t.trim()).filter(Boolean)
        : frontmatter.tags)
    : []

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-8" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-8" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Post not found.</p>
          <Link to="/blog" className="text-cyan-500 hover:text-cyan-400 transition-colors">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  const coverUrl = frontmatter.cover ? resolveImageUrl(slug, frontmatter.cover) : null

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen pb-16" ref={articleRef}>
        {/* Hero */}
        {coverUrl ? (
          <div className="relative w-full h-72 md:h-96 overflow-hidden">
            <img src={coverUrl} alt={frontmatter.title} className="w-full h-full object-cover" onError={e => { e.currentTarget.parentElement.style.display = 'none' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-6xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-cyan-400 transition-colors mb-4 bg-black/30 px-3 py-1.5 rounded-full">
                ← Back to Blog
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{frontmatter.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                {frontmatter.date && <span>{new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
                <span>·</span>
                <span>{readingTime} min read</span>
                {tagList.length > 0 && tagList.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-24 px-6 max-w-6xl mx-auto">
            <AnimatedSection>
              <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-500 transition-colors mb-8 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                ← Back to Blog
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{frontmatter.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
                {frontmatter.date && <span>{new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>}
                <span>·</span>
                <span>{readingTime} min read</span>
                {tagList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tagList.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        )}

        <div className={`px-6 max-w-6xl mx-auto ${coverUrl ? 'pt-10' : ''}`}>
          <div className="flex gap-12">
            {/* Main content */}
            <article className="flex-1 min-w-0">
              <AnimatedSection delay={0.1}>
                <div className="prose prose-gray dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
                  prose-a:text-cyan-500 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-500/5 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-gray-700 dark:prose-li:text-gray-300
                  prose-table:text-sm
                  prose-img:rounded-xl prose-img:shadow-lg">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={components}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2} className="mt-16">
                <h3 className="text-lg font-semibold mb-6">Comments</h3>
                <Giscus
                  repo={GISCUS_REPO}
                  repoId={GISCUS_REPO_ID}
                  category={GISCUS_CATEGORY}
                  categoryId={GISCUS_CATEGORY_ID}
                  mapping="pathname"
                  strict="0"
                  reactionsEnabled="1"
                  emitMetadata="0"
                  inputPosition="top"
                  theme="preferred_color_scheme"
                  lang="en"
                  loading="lazy"
                />
              </AnimatedSection>
            </article>

            {/* TOC sidebar */}
            {headings.length > 0 && (
              <aside className="hidden xl:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                  <p className="text-xs font-mono text-cyan-500 uppercase tracking-wider mb-3">On this page</p>
                  <nav className="space-y-1">
                    {headings.map(h => (
                      <button
                        key={h.id}
                        onClick={() => scrollToHeading(h.id)}
                        className={`block w-full text-left text-sm transition-colors ${h.level === 3 ? 'pl-3' : ''} ${
                          activeHeading === h.id
                            ? 'text-cyan-500 font-medium'
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {h.text}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
