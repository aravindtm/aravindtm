import { motion } from 'framer-motion'
import AnimatedSection from '../components/AnimatedSection'
import {
  FiCloud, FiBox, FiLayers, FiGitBranch, FiTerminal, FiActivity
} from 'react-icons/fi'

const categories = [
  {
    title: 'Cloud & Platforms',
    icon: FiCloud,
    skills: ['AWS', 'Azure', 'GCP'],
  },
  {
    title: 'Containers & Orchestration',
    icon: FiBox,
    skills: ['Kubernetes', 'Docker', 'Helm', 'ArgoCD'],
  },
  {
    title: 'Infrastructure as Code',
    icon: FiLayers,
    skills: ['Terraform', 'Ansible', 'CloudFormation'],
  },
  {
    title: 'CI/CD',
    icon: FiGitBranch,
    skills: ['GitHub Actions', 'Jenkins', 'GitLab CI'],
  },
  {
    title: 'Languages & Scripting',
    icon: FiTerminal,
    skills: ['Python', 'Bash', 'Go', 'YAML'],
  },
  {
    title: 'Monitoring & Observability',
    icon: FiActivity,
    skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'],
  },
]

export default function Skills() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-mono text-cyan-500 mb-2 tracking-wider uppercase">Skills</p>
          <h2 className="text-4xl font-bold mb-12">Tech Stack & Tools</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
