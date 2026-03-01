import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '../components/AnimatedSection'
import { FiGithub, FiExternalLink, FiStar, FiGitBranch } from 'react-icons/fi'

const GITHUB_USERNAME = 'aravindtm'

export default function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`)
      .then((r) => r.json())
      .then((data) => {
        const filtered = data
          .filter((r) => !r.fork && r.name !== GITHUB_USERNAME)
          .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
          .slice(0, 6)
        setRepos(filtered)
      })
      .catch(() => setRepos([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-mono text-cyan-500 mb-2 tracking-wider uppercase">Projects</p>
          <h2 className="text-4xl font-bold mb-4">My Work</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-xl">
            A selection of my public repositories. Visit my GitHub for the full list.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : repos.length === 0 ? (
          <p className="text-gray-500">No repositories found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <AnimatedSection key={repo.id} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }} className="card h-full flex flex-col">
                  <h3 className="font-semibold text-lg mb-2 truncate">{repo.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-2">
                    {repo.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiStar className="w-3.5 h-3.5" /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiGitBranch className="w-3.5 h-3.5" /> {repo.forks_count}
                      </span>
                    </div>

                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-cyan-500 transition-colors"
                      aria-label={`View ${repo.name} on GitHub`}
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        )}

        <AnimatedSection className="mt-12 text-center">
          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg font-medium transition-colors"
          >
            <FiGithub /> View All on GitHub
          </a>
        </AnimatedSection>
      </div>
    </div>
  )
}
