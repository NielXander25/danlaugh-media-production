'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTestimonials } from '@/lib/hooks/useTestimonials'
import TestimonialCard from '@/components/ui/TestimonialCard'
import { Loader2 } from 'lucide-react'

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { testimonials, loading, error } = useTestimonials(true)

  return (
    <section id="testimonials" ref={ref} className="section-padding bg-bg-secondary relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-accent/3 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-accent" />
            <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">Testimonials</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            What Clients Say
          </h2>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-accent animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-text-secondary">
            <p>Failed to load testimonials.</p>
          </div>
        )}

        {!loading && !error && testimonials.length === 0 && (
          <div className="text-center py-20 text-text-secondary">
            <p>No testimonials yet.</p>
          </div>
        )}

        {!loading && !error && testimonials.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} inView={inView} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
