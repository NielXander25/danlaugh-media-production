'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  index: number
  onOpen: (project: Project) => void
}

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const thumbnailUrl = project.thumbnail_url ||
    `https://img.youtube.com/vi/${project.video_id}/maxresdefault.jpg`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onOpen(project)}
      className="group relative cursor-pointer overflow-hidden rounded-sm border border-white/8 hover:border-accent/25 transition-all duration-300 card-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-white/5">
        <Image
          src={thumbnailUrl}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="w-14 h-14 rounded-full bg-accent/80 group-hover:bg-accent flex items-center justify-center shadow-xl shadow-accent/25 transition-colors duration-300"
          >
            <Play size={20} className="text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm text-xs text-text-secondary border border-white/10 rounded-sm">
          {project.category}
        </span>

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-accent/80 text-xs text-white rounded-sm">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-bg-secondary">
        <h3 className="font-display font-semibold text-white text-base group-hover:text-accent transition-colors duration-300 line-clamp-1">
          {project.title}
        </h3>
      </div>
    </motion.div>
  )
}
