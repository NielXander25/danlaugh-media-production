'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

// Detect video source and return proper embed URL
function getEmbedUrl(videoId: string): { url: string; externalUrl: string } {
  // Google Drive: full URL or just file ID
  if (videoId.includes('drive.google.com') || videoId.includes('/d/')) {
    const match = videoId.match(/\/d\/([a-zA-Z0-9_-]+)/)
    const id = match ? match[1] : videoId
    return {
      url: `https://drive.google.com/file/d/${id}/preview`,
      externalUrl: `https://drive.google.com/file/d/${id}/view`,
    }
  }

  // Vimeo: full URL or just ID (numeric)
  if (videoId.includes('vimeo.com') || /^\d+$/.test(videoId) && videoId.length > 6) {
    const id = videoId.replace(/.*vimeo\.com\//, '').split('?')[0]
    return {
      url: `https://player.vimeo.com/video/${id}?autoplay=1`,
      externalUrl: `https://vimeo.com/${id}`,
    }
  }

  // YouTube: full URL or just video ID (default)
  const ytMatch = videoId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  const ytId = ytMatch ? ytMatch[1] : videoId
  return {
    url: `https://www.youtube.com/embed/${ytId}?rel=0&autoplay=1`,
    externalUrl: `https://youtube.com/watch?v=${ytId}`,
  }
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [project])

  const embed = project ? getEmbedUrl(project.video_id) : null

  return (
    <AnimatePresence>
      {project && embed && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/92 modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col bg-bg-secondary border border-white/10 rounded-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
              <div>
                <h3 className="font-display font-semibold text-white text-base md:text-lg leading-tight">
                  {project.title}
                </h3>
                <span className="text-text-secondary text-xs">{project.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={embed.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-white/10 hover:border-white/20 rounded-sm transition-colors"
                >
                  <ExternalLink size={12} />
                  Open
                </a>
                <button
                  onClick={onClose}
                  className="p-1.5 text-text-secondary hover:text-accent transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video */}
            <div className="flex-1 p-4 md:p-6 min-h-0">
              <div className="video-container w-full h-full rounded-sm overflow-hidden">
                <iframe
                  src={embed.url}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
