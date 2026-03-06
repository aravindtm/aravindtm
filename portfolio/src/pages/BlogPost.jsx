import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Giscus from '@giscus/react'
import AnimatedSection from '../components/AnimatedSection'
import { RAW_BASE, parseFrontmatter, estimateReadingTime, resolveImageUrl } from '../utils/blogUtils'

// TODO: Fill in these values from https://giscus.app after enabling Discussions on my-blogs repo
const GISCUS_REPO = 'aravindtm/my-blogs'
const GISCUS_REPO_ID = 'YOUR-REPO-ID'
const GISCUS_CATEGORY = 'Announcements'
const GISCUS_CATEGORY_ID = 'YOUR-CATEGORY-ID'

function extractHeadings(markdown) {
  const lines = markdown.split('\n')
  return lines
    .filter(l => /^#{2,3}\s/.test(l))
    .map(l => {
      const level = l.match(/^(#{2,3})/)[1].length
      const text = l.replace(/^#{2,3}\s+/, '')
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      return { level, text, id }
    })
}

export default function BlogPost() {
  const { slug } = useParams()
  const [raw, setRaw] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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

  const { data: frontmatter, content } = useMemo(() => {
    if (!raw) return { data: {}, content: '' }
    return parseFrontmatter(raw)
  }, [raw])

  const headings = useMemo(() => content ? extractHeadings(content) : [], [content])
  const readingTime = useMemo(() => content ? estimateReadingTime(content) : 0, [content])

  // Resolve relative image src to raw GitHub URLs
  const components = useMemo(() => ({
    img({ src, alt, ...props }) {
      return <img src={resolveImageUrl(slug, src)} alt={alt} {...props} className="rounded-lg max-w-full my-4" />
    },
    h2({ children, ...props }) {
      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      return <h2 id={id} {...props}>{children}</h2>
    },
    h3({ children, ...props }) {
      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      return <h3 id={id} {...props}>{children}</h3>
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-500 transition-colors mb-8">
            ← Back to Blog
          </Link>
        </AnimatedSection>

        <div className="flex gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            <AnimatedSection>
              <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
                {frontmatter.date && (
                  <span>{new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
                <span>·</span>
                <span>{readingTime} min read</span>
                {tagList.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tagList.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {frontmatter.cover && (
                <img
                  src={resolveImageUrl(slug, frontmatter.cover)}
                  alt={frontmatter.title}
                  className="w-full h-64 object-cover rounded-xl mb-8"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              )}
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-cyan-500 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-img:rounded-lg">
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
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors ${h.level === 3 ? 'pl-3' : ''}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
