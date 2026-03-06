'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Film, Music, Building, Heart, Tv, Zap } from 'lucide-react'

const services = [
  {
    icon: Film,
    title: 'Commercial Videos',
    description: 'High-impact brand commercials that capture attention and convert viewers into customers. Built for broadcast and digital platforms.',
  },
  {
    icon: Music,
    title: 'Music Videos',
    description: 'Visually stunning music videos that amplify your sound and build your artist identity. We bring the vision behind the music to life.',
  },
  {
    icon: Film,
    title: 'Documentaries',
    description: 'Compelling documentary films that tell authentic stories with depth and nuance. We craft narratives that leave lasting impressions.',
  },
  {
    icon: Heart,
    title: 'Wedding Films',
    description: 'Cinematic wedding films that preserve your most precious moments forever. Emotional, timeless, and beautifully crafted.',
  },
  {
    icon: Building,
    title: 'Corporate Films',
    description: 'Professional corporate videos that communicate your brand values, showcase your team, and elevate your company image.',
  },
  {
    icon: Zap,
    title: 'Short Films',
    description: 'Award-worthy short films with cinematic quality and storytelling power. We elevate independent creators to the next level.',
  },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" ref={ref} className="section-padding bg-black relative overflow-hidden">
      {/* BG accents */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-accent/3 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-8 h-px bg-accent" />
            <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">What We Do</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-white"
          >
            Our Services
          </motion.h2>
        </div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                className="group relative p-6 border border-white/8 hover:border-accent/25 bg-white/[0.02] hover:bg-white/[0.04] rounded-sm transition-all duration-300 card-hover grain"
              >
                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 group-hover:bg-accent/15 rounded-sm mb-5 transition-colors duration-300">
                  <Icon size={18} className="text-accent" />
                </div>

                <h3 className="font-display font-semibold text-lg text-white mb-3 group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-accent to-transparent transition-all duration-500" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
