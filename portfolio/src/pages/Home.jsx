import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiGithub } from 'react-icons/fi'

const roles = ['Cloud Engineer', 'DevOps Engineer', 'Infrastructure Architect', 'Automation Enthusiast']

function useTypingEffect(strings, typingSpeed = 80, deletingSpeed = 40, pause = 2000) {
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = strings[index]
    let timeout

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % strings.length)
    } else {
      timeout = setTimeout(() => {
        setText(current.substring(0, text.length + (deleting ? -1 : 1)))
      }, deleting ? deletingSpeed : typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [text, index, deleting, strings, typingSpeed, deletingSpeed, pause])

  return text
}

export default function Home() {
  const typed = useTypingEffect(roles)

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-mono text-cyan-500 mb-4 tracking-wider uppercase">
            Welcome to my portfolio
          </p>

          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            Hi, I&apos;m{' '}
            <span className="gradient-text">Aravind</span>
          </h1>

          <div className="h-12 sm:h-14 flex items-center justify-center mb-8">
            <span className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-mono">
              {typed}
              <span className="cursor-blink text-cyan-500">|</span>
            </span>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            I build reliable cloud infrastructure, automate everything, and help teams ship with confidence.
            Passionate about Kubernetes, IaC, and CI/CD pipelines.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
            >
              View Projects <FiArrowRight />
            </Link>
            <a
              href="https://github.com/aravindtm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 rounded-lg font-medium transition-colors"
            >
              <FiGithub /> GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
