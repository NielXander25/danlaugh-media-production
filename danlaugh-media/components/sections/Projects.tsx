'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useProjects } from '@/lib/hooks/useProjects'
import ProjectModal from '@/components/ui/ProjectModal'
import type { Project } from '@/types'
import { Loader2, Play, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

const GENRES = [
  'Motion Graphics',
  'Documentary',
  'Talking Head',
  'YouTube Short Films',
  'Fashion',
  'Wedding',
  'Sports',
  'Music',
  'Animation',
]

function GenreSection({
  genre,
  projects,
  onOpen,
}: {
  genre: string
  projects: Project[]
  onOpen: (p: Project) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  if (projects.length === 0) return null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      {/* Genre header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 mb-6 group"
      >
        <div className="flex items-center gap-4">
          <span className="w-1 h-6 bg-accent rounded-full" />
          <h3 className="font-display font-bold text-xl md:text-2xl text-white group-hover:text-accent transition-colors duration-300">
            {genre}
          </h3>
          <span className="text-text-secondary text-sm font-mono">
            {projects.length} {projects.length === 1 ? 'video' : 'videos'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary group-hover:text-accent transition-colors">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Videos grid — 4 per row */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {projects.map((project, i) => (
                <VideoCard
                  key={project.id}
                  project={project}
                  index={i}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mt-10 h-px bg-white/5" />
    </motion.div>
  )
}

function VideoCard({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
}) {
  const thumbnailUrl =
    project.thumbnail_url ||
    (project.video_id.length === 11
      ? `https://img.youtube.com/vi/${project.video_id}/mqdefault.jpg`
      : '/placeholder-thumb.jpg')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onClick={() => onOpen(project)}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-sm bg-white/5 border border-white/8 group-hover:border-accent/30 transition-all duration-300">
        {thumbnailUrl.startsWith('/') || thumbnailUrl.startsWith('http') ? (
          <img
            src={thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%23111'/%3E%3C/svg%3E"
            }}
          />
        ) : null}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-accent/80 group-hover:bg-accent group-hover:scale-110 flex items-center justify-center shadow-lg shadow-accent/25 transition-all duration-300">
            <Play size={14} className="text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-accent/90 text-white text-xs rounded-sm">
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <p className="mt-2 text-sm text-text-secondary group-hover:text-white transition-colors duration-300 line-clamp-1 font-medium">
        {project.title}
      </p>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { projects, loading, error } = useProjects()
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  // Group projects by genre
  const byGenre = GENRES.reduce<Record<string, Project[]>>((acc, genre) => {
    acc[genre] = projects.filter((p) => p.category === genre)
    return acc
  }, {})

  return (
    <section id="projects" ref={ref} className="section-padding bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-accent/3 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-accent" />
            <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">
              Portfolio
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Our Projects
          </h2>
          <p className="text-text-secondary text-base max-w-xl">
            Explore our work across {GENRES.length} creative categories. Click any video to watch.
          </p>
        </motion.div>

        {/* Genre pills — 5 cols on desktop (9 genres, wraps naturally) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-14"
        >
          {GENRES.map((genre) => {
            const count = byGenre[genre]?.length || 0
            return (
              <button
                key={genre}
                onClick={() => {
                  const el = document.getElementById(`genre-${genre.replace(/\s+/g, '-')}`)
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="group flex items-center justify-between gap-2 px-4 py-3 border border-white/8 hover:border-accent/40 bg-white/[0.02] hover:bg-accent/5 rounded-sm transition-all duration-300"
              >
                <span className="text-text-secondary group-hover:text-white text-sm font-medium transition-colors truncate">
                  {genre}
                </span>
                <span className="text-xs font-mono text-accent flex-shrink-0">
                  {count}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-accent animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-24 text-text-secondary">
            <p>Failed to load projects. Please try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-24 text-text-secondary border border-white/5 rounded-sm">
            <Play size={40} className="mx-auto mb-4 text-accent/30" />
            <p className="text-lg font-display">No projects yet</p>
            <p className="text-sm mt-1">Add videos from the admin dashboard</p>
          </div>
        )}

        {/* Genre sections */}
        {!loading && !error && projects.length > 0 && (
          <div>
            {GENRES.map((genre) => (
              <div key={genre} id={`genre-${genre.replace(/\s+/g, '-')}`}>
                <GenreSection
                  genre={genre}
                  projects={byGenre[genre]}
                  onOpen={setActiveProject}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  )
}
