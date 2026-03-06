import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RAW_BASE } from '../utils/blogUtils'

export default function BlogCard({ slug, title, date, tags, cover, excerpt, readingTime, featured = false }) {
  const coverUrl = cover ? `${RAW_BASE}/posts/${slug}/${cover}` : null
  const tagList = typeof tags === 'string'
    ? tags.split(',').map(t => t.trim()).filter(Boolean)
    : (Array.isArray(tags) ? tags : [])

  if (featured) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] transition-all duration-300"
      >
        <Link to={`/blog/${slug}`} className="flex flex-col md:flex-row gap-0">
          {/* Image */}
          <div className="md:w-1/2 overflow-hidden">
            {coverUrl ? (
              <div className="relative h-56 md:h-full">
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.currentTarget.parentElement.className = 'h-56 md:h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 dark:to-gray-900/10" />
              </div>
            ) : (
              <div className="h-56 md:h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                <span className="text-6xl text-cyan-500/40 font-bold select-none">✍</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <span className="text-xs font-mono text-cyan-500 uppercase tracking-wider mb-3">Featured</span>
            <h3 className="font-bold text-2xl md:text-3xl mb-3 group-hover:text-cyan-500 transition-colors line-clamp-3">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed">{excerpt}</p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {tagList.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span className="mx-1.5">·</span>
                <span>{readingTime} min read</span>
              </div>
              <span className="text-sm font-medium text-cyan-500 group-hover:text-cyan-400 flex items-center gap-1">
                Read <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group card h-full flex flex-col overflow-hidden hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)] transition-all duration-300"
    >
      {/* Cover */}
      <div className="overflow-hidden rounded-xl mb-4 -mx-1">
        {coverUrl ? (
          <div className="relative h-48 overflow-hidden rounded-xl">
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={e => { e.currentTarget.parentElement.className = 'h-48 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="h-48 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
            <span className="text-4xl text-cyan-500/40 font-bold select-none">✍</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        <span>·</span>
        <span>{readingTime} min read</span>
      </div>

      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-cyan-500 transition-colors">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">{excerpt}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tagList.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">{tag}</span>
        ))}
      </div>

      <Link
        to={`/blog/${slug}`}
        className="text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors mt-auto flex items-center gap-1"
      >
        Read more <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
      </Link>
    </motion.div>
  )
}
