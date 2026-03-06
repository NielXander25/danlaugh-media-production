'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import type { Testimonial } from '@/types'

interface TestimonialCardProps {
  testimonial: Testimonial
  index: number
  inView: boolean
}

export default function TestimonialCard({ testimonial, index, inView }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="group relative p-6 border border-white/8 hover:border-accent/20 bg-bg-secondary hover:bg-white/[0.03] rounded-sm transition-all duration-300 card-hover grain"
    >
      {/* Quote icon */}
      <Quote size={24} className="text-accent/30 group-hover:text-accent/50 transition-colors duration-300 mb-4" />

      {/* Message */}
      <p className="text-text-secondary leading-relaxed text-sm mb-6 italic">
        &ldquo;{testimonial.message}&rdquo;
      </p>

      {/* Divider */}
      <div className="w-8 h-px bg-accent/40 mb-4" />

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.avatar_url ? (
          <img
            src={testimonial.avatar_url}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center ring-1 ring-accent/20">
            <span className="text-accent font-display font-bold text-sm">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold text-white text-sm">{testimonial.name}</div>
          <div className="text-text-secondary text-xs">
            {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
          </div>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-accent/50 to-transparent transition-all duration-500" />
    </motion.div>
  )
}
