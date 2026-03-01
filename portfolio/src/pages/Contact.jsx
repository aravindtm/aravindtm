import AnimatedSection from '../components/AnimatedSection'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'

const links = [
  {
    icon: FiGithub,
    label: 'GitHub',
    value: 'aravindtm',
    href: 'https://github.com/aravindtm',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'Connect with me',
    href: 'https://linkedin.com/in/YOUR-LINKEDIN',
  },
  {
    icon: FiMail,
    label: 'Email',
    value: 'YOUR-EMAIL@example.com',
    href: 'mailto:YOUR-EMAIL@example.com',
  },
]

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-mono text-cyan-500 mb-2 tracking-wider uppercase">Contact</p>
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-xl">
            I&apos;m always open to discussing new opportunities, interesting projects, or collaborations.
            Feel free to reach out.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {links.map((link, i) => (
            <AnimatedSection key={link.label} delay={i * 0.1}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex flex-col items-center text-center gap-3 hover:border-cyan-500/50 transition-all group"
              >
                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 transition-colors">
                  <link.icon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-cyan-500 transition-colors" />
                </div>
                <div>
                  <p className="font-semibold">{link.label}</p>
                  <p className="text-sm text-gray-500">{link.value}</p>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="card max-w-lg mx-auto">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiSend className="text-cyan-500" /> Send a Message
            </h3>
            <form
              action="https://formspree.io/f/YOUR-FORM-ID"
              method="POST"
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
