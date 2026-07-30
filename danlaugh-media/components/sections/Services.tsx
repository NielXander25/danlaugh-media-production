'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Film, Music, Building, Heart, Zap, Sparkles, ChevronDown, ChevronUp, Play, Loader2 } from 'lucide-react'
import { useProjects } from '@/lib/hooks/useProjects'
import ProjectModal from '@/components/ui/ProjectModal'
import type { Project } from '@/types'

const SERVICES = [
  {
    icon: Film,
    genre: 'Motion Graphics',
    title: 'Motion Graphics',
    description: 'Dynamic animated visuals that elevate your brand and communicate complex ideas with style and clarity.',
  },
  {
    icon: Film,
    genre: 'Documentary',
    title: 'Documentary',
    description: 'Compelling documentary films that tell authentic stories with depth, nuance, and emotional power.',
  },
  {
    icon: Film,
    genre: 'Talking Head',
    title: 'Talking Head',
    description: 'Professional interview-style videos that position you as an authority and connect with your audience.',
  },
  {
    icon: Zap,
    genre: 'YouTube Short Films',
    title: 'YouTube Short Films',
    description: 'Punchy, scroll-stopping short-form content optimized for YouTube and social media platforms.',
  },
  {
    icon: Sparkles,
    genre: 'Fashion',
    title: 'Fashion',
    description: 'High-end fashion films and lookbooks that capture the essence of your brand and collection.',
  },
  {
    icon: Heart,
    genre: 'Wedding',
    title: 'Wedding Films',
    description: 'Cinematic wedding films that preserve your most precious moments forever. Emotional and timeless.',
  },
  {
    icon: Zap,
    genre: 'Sports',
    title: 'Sports',
    description: 'High-energy sports edits and highlight reels that capture the intensity and drama of the game.',
  },
  {
    icon: Music,
    genre: 'Music',
    title: 'Music Videos',
    description: 'Visually stunning music videos that amplify your sound and build your artist identity.',
  },
  {
    icon: Sparkles,
    genre: 'Animation',
    title: 'Animation',
    description: 'Creative 2D and 3D animations that bring your ideas to life with imagination and precision.',
  },
  {
    icon: Zap,
    genre: 'Social Media Reels',
    title: 'Social Media Reels',
    description: 'Fast-paced, engaging reels crafted for Instagram, TikTok, and Facebook that stop the scroll and drive engagement.',
  },
  {
    icon: Film,
    genre: 'Others',
    title: 'Others',
    description: 'Have a unique project that doesn\'t fit a category? We\'re open to creative briefs of all kinds.',
  },
]

function ServiceCard({
  service,
  index,
  inView,
}: {
  service: typeof SERVICES[0]
  index: number
  inView: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const { projects, loading } = useProjects()
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  const genreProjects = projects.filter((p) => p.category === service.genre)
  const Icon = service.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.07 }}
        className="border border-white/8 rounded-sm overflow-hidden transition-all duration-300"
      >
        {/* Card header — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="group w-full relative p-6 bg-white/[0.02] hover:bg-white/[0.04] hover:border-accent/25 transition-all duration-300 text-left flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-accent/10 group-hover:bg-accent/15 rounded-sm transition-colors duration-300">
              <Icon size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-accent transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {service.description}
              </p>
              {genreProjects.length > 0 && (
                <span className="inline-flex items-center gap-1 mt-3 text-xs text-accent font-mono">
                  <Play size={10} fill="currentColor" />
                  {genreProjects.length} {genreProjects.length === 1 ? 'video' : 'videos'}
                </span>
              )}
            </div>
          </div>

          {/* Expand toggle */}
          <div className="flex-shrink-0 mt-1 text-text-secondary group-hover:text-accent transition-colors">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-accent to-transparent transition-all duration-500" />
        </button>

        {/* Expanded videos */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="p-6 bg-black/30">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="text-accent animate-spin" />
                  </div>
                ) : genreProjects.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary text-sm">
                    No videos in this category yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {genreProjects.map((project, i) => (
                      <button
                        key={project.id}
                        onClick={() => setActiveProject(project)}
                        className="group/card text-left"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-sm bg-white/5 border border-white/8 group-hover/card:border-accent/30 transition-all duration-300">
                          <img
                            src={
                              project.thumbnail_url ||
                              (project.video_id.length === 11
                                ? `https://img.youtube.com/vi/${project.video_id}/mqdefault.jpg`
                                : undefined)
                            }
                            alt={project.title}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%23111'/%3E%3C/svg%3E"
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/20 transition-colors duration-300" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-accent/80 group-hover/card:bg-accent group-hover/card:scale-110 flex items-center justify-center transition-all duration-300">
                              <Play size={12} className="text-white ml-0.5" fill="white" />
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-text-secondary group-hover/card:text-white transition-colors line-clamp-1">
                          {project.title}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  )
}

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" ref={ref} className="section-padding bg-black relative overflow-hidden">
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
            className="font-display font-bold text-4xl md:text-5xl text-white mb-4"
          >
            Our Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-text-secondary text-base max-w-xl"
          >
            Explore Some Of the Services We&apos;ve Worked on — click any category to see our work.
          </motion.p>
        </div>

        {/* Services list */}
        <div className="space-y-4">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.genre} service={service} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
