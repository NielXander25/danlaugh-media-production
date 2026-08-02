'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useAbout } from '@/lib/hooks/useAbout'
import { Award, Film, Users } from 'lucide-react'

const skills = [
  'Color Grading', 'Motion Graphics', 'Sound Design',
  'Cinematic Editing', 'VFX Integration', 'Brand Films',
]

// Detect media type from URL
function getMediaType(url: string): 'video' | 'gif' | 'image' {
  const lower = url.toLowerCase()
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) return 'video'
  if (lower.endsWith('.gif')) return 'gif'
  return 'image'
}

function MediaDisplay({ url, alt }: { url: string; alt: string }) {
  const type = getMediaType(url)

  if (type === 'video') {
    return (
      <video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    )
  }

  // gif or image — both use img tag
  return (
    <img
      src={url}
      alt={alt}
      className="w-full h-full object-cover"
    />
  )
}

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { about, loading } = useAbout()

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.6, ease: 'easeInOut', delay },
  })

  return (
    <section id="about" ref={ref} className="section-padding bg-bg-secondary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-16">
          <span className="w-8 h-px bg-accent" />
          <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">About Us</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Animated Logo / Profile Media */}
          <motion.div {...fadeUp(0.1)} className="relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 overflow-hidden rounded-sm">
              {/* Decorative frame */}
              <div className="absolute -top-3 -left-3 w-24 h-24 border-l-2 border-t-2 border-accent/40 z-10" />
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-accent/40 z-10" />

              {loading ? (
                <div className="w-full h-full bg-white/5 animate-pulse" />
              ) : about?.image_url ? (
                <MediaDisplay
                  url={about.image_url}
                  alt="Danlaugh Media Production"
                />
              ) : (
                /* Default: show the local animated logo from public folder */
                <video
                  src="/logo-animated.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Experience badge */}
            <motion.div
              {...fadeUp(0.3)}
              className="absolute -bottom-6 -right-0 lg:-right-6 bg-black border border-white/10 px-5 py-4 rounded-sm"
            >
              <div className="font-display font-bold text-3xl text-accent">5+</div>
              <div className="text-text-secondary text-xs tracking-wider uppercase mt-1">Years Experience</div>
            </motion.div>
          </motion.div>

          {/* Right: Bio */}
          <div className="space-y-6">
            <motion.h2 {...fadeUp(0.15)} className="font-display font-bold text-4xl md:text-5xl text-white leading-tight">
              Crafting Stories That{' '}
              <span className="text-accent">Resonate</span>
            </motion.h2>

            <motion.p {...fadeUp(0.2)} className="text-text-secondary leading-relaxed text-base">
              Danlaugh Media Production is a creative video production studio dedicated to telling
              powerful visual stories. Founded on the belief that every frame matters, we bring
              cinematic excellence to every project — whether it&apos;s a brand commercial, music video,
              or documentary.
            </motion.p>

            <motion.p {...fadeUp(0.25)} className="text-text-secondary leading-relaxed text-base">
              Our approach blends technical mastery with artistic intuition. We don&apos;t just edit
              videos — we sculpt narratives, build emotions, and create moments that linger long
              after the screen goes dark.
            </motion.p>

            {/* Skills */}
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-xs border border-white/8 text-text-secondary hover:border-accent/30 hover:text-accent transition-colors duration-300 rounded-sm"
                >
                  {skill}
                </span>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div {...fadeUp(0.35)} className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
              {[
                { icon: Film, value: '200+', label: 'Projects Done' },
                { icon: Users, value: '80+', label: 'Happy Clients' },
                { icon: Award, value: '12+', label: 'Awards Won' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon size={16} className="text-accent mx-auto mb-2" />
                  <div className="font-display font-bold text-xl text-white">{value}</div>
                  <div className="text-text-secondary text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
