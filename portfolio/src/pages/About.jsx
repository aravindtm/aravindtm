import AnimatedSection from '../components/AnimatedSection'
import { FiBriefcase, FiBookOpen } from 'react-icons/fi'

const timeline = [
  {
    type: 'work',
    title: 'Cloud & DevOps Engineer',
    org: 'Your Company',
    period: '2022 – Present',
    description: 'Designing and managing cloud infrastructure on AWS/Azure. Building CI/CD pipelines, Kubernetes clusters, and IaC with Terraform.',
  },
  {
    type: 'work',
    title: 'DevOps Engineer',
    org: 'Previous Company',
    period: '2019 – 2022',
    description: 'Automated deployments with Ansible and Jenkins. Containerized applications with Docker and orchestrated with Kubernetes.',
  },
  {
    type: 'education',
    title: 'Bachelor of Engineering',
    org: 'Your University',
    period: '2015 – 2019',
    description: 'Computer Science & Engineering',
  },
]

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <p className="text-sm font-mono text-cyan-500 mb-2 tracking-wider uppercase">About Me</p>
          <h2 className="text-4xl font-bold mb-8">Background & Experience</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-12 max-w-2xl">
            I&apos;m a Cloud & DevOps Engineer with a passion for building scalable, reliable infrastructure.
            I specialize in cloud-native technologies, infrastructure as code, and automating the software delivery lifecycle.
            I thrive on solving complex infrastructure challenges and empowering development teams to ship faster.
          </p>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

          {timeline.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.1} className="relative pl-12 pb-10 last:pb-0">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 border-cyan-500 bg-white dark:bg-gray-950" />
              <div className="flex items-center gap-2 mb-1 text-sm text-gray-500 dark:text-gray-500">
                {item.type === 'work' ? <FiBriefcase /> : <FiBookOpen />}
                <span>{item.period}</span>
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-cyan-500 font-medium text-sm mb-2">{item.org}</p>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
