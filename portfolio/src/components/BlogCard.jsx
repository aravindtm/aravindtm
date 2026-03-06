import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RAW_BASE } from '../utils/blogUtils'

export default function BlogCard({ slug, title, date, tags, cover, excerpt, readingTime }) {
  const coverUrl = cover ? `${RAW_BASE}/posts/${slug}/${cover}` : null
  const tagList = typeof tags === 'string'
    ? tags.split(',').map(t => t.trim()).filter(Boolean)
    : (Array.isArray(tags) ? tags : [])

  return (
    <motion.div whileHover={{ y: -4 }} className="card h-full flex flex-col">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-40 object-cover rounded-lg mb-4"
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      ) : (
        <div className="w-full h-40 rounded-lg mb-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
          <span className="text-4xl text-cyan-500/40 font-bold select-none">✍</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        <span>·</span>
        <span>{readingTime} min read</span>
      </div>

      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-cyan-500">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">{excerpt}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tagList.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            {tag}
          </span>
        ))}
      </div>

      <Link
        to={`/blog/${slug}`}
        className="text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors mt-auto"
      >
        Read more →
      </Link>
    </motion.div>
  )
}
