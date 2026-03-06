import { useEffect, useState } from 'react'
import AnimatedSection from '../components/AnimatedSection'
import BlogCard from '../components/BlogCard'
import { RAW_BASE, estimateReadingTime } from '../utils/blogUtils'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState(null)

  useEffect(() => {
    fetch(`${RAW_BASE}/index.json`)
      .then(r => r.json())
      .then(data => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const allTags = [...new Set(
    posts.flatMap(p => {
      const tags = typeof p.tags === 'string'
        ? p.tags.split(',').map(t => t.trim()).filter(Boolean)
        : (Array.isArray(p.tags) ? p.tags : [])
      return tags
    })
  )]

  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = posts.filter(p => {
      const tags = typeof p.tags === 'string'
        ? p.tags.split(',').map(t => t.trim())
        : (Array.isArray(p.tags) ? p.tags : [])
      return tags.includes(tag)
    }).length
    return acc
  }, {})

  const filtered = selectedTag
    ? posts.filter(p => {
        const tags = typeof p.tags === 'string'
          ? p.tags.split(',').map(t => t.trim())
          : (Array.isArray(p.tags) ? p.tags : [])
        return tags.includes(selectedTag)
      })
    : posts

  const [featured, ...rest] = filtered

  return (
    <div className="min-h-screen pb-16">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-32 pb-20 px-6">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 70% 20%, #3b82f6 0%, transparent 40%)'
        }} />
        <div className="relative max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="text-sm font-mono text-cyan-400 mb-3 tracking-widest uppercase">Blog</p>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Writing</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Thoughts on DevOps, cloud infrastructure, and engineering.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Tag filters */}
        {allTags.length > 0 && (
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 mb-12">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                  selectedTag === null
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-cyan-500/50'
                }`}
              >
                All <span className="ml-1 text-xs opacity-60">{posts.length}</span>
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-all ${
                    selectedTag === tag
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-cyan-500/50'
                  }`}
                >
                  {tag} <span className="ml-1 text-xs opacity-60">{tagCounts[tag]}</span>
                </button>
              ))}
            </div>
          </AnimatedSection>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          <>
            {/* Featured first post */}
            {featured && (
              <AnimatedSection className="mb-10">
                <BlogCard
                  {...featured}
                  readingTime={estimateReadingTime(featured.excerpt || '')}
                  featured
                />
              </AnimatedSection>
            )}

            {/* Rest in grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post, i) => (
                  <AnimatedSection key={post.slug} delay={i * 0.08}>
                    <BlogCard
                      {...post}
                      readingTime={estimateReadingTime(post.excerpt || '')}
                    />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
