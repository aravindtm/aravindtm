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

  const filtered = selectedTag
    ? posts.filter(p => {
        const tags = typeof p.tags === 'string'
          ? p.tags.split(',').map(t => t.trim())
          : (Array.isArray(p.tags) ? p.tags : [])
        return tags.includes(selectedTag)
      })
    : posts

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-mono text-cyan-500 mb-2 tracking-wider uppercase">Blog</p>
          <h2 className="text-4xl font-bold mb-4">Writing</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
            Thoughts on DevOps, cloud infrastructure, and engineering.
          </p>
        </AnimatedSection>

        {allTags.length > 0 && (
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  selectedTag === null
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                    : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    selectedTag === tag
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                      : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </AnimatedSection>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.08}>
                <BlogCard
                  {...post}
                  readingTime={estimateReadingTime(post.excerpt || '')}
                />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
