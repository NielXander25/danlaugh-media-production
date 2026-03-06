'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Play } from 'lucide-react'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeInOut', delay },
  }),
}

export default function Hero() {
  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollDown = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/3 rounded-full blur-[80px]" />
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content — single vertical stack, no absolute children */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center gap-0">

        {/* Eyebrow */}
        <motion.div
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="w-8 h-px bg-accent" />
          <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">
            Video Production Studio
          </span>
          <span className="w-8 h-px bg-accent" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6"
        >
          <span className="block text-white">Dream.</span>
          <span className="block text-white">Create.</span>
          <span className="block text-accent glow-green-text">Capture.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          custom={0.35}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="text-text-secondary font-body text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
        >
          We craft cinematic stories that move people — from commercial campaigns to
          music videos, documentaries, and beyond.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={0.45}
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm sm:max-w-none mb-12"
        >
          <button
            onClick={scrollToProjects}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-medium rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/25"
          >
            <Play size={16} className="group-hover:scale-110 transition-transform" fill="white" />
            View Our Work
          </button>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 border border-white/10 hover:border-accent/40 text-white font-medium rounded-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/5"
          >
            Start a Project
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center gap-8 sm:gap-12 px-8 py-4 border border-white/5 rounded-sm bg-white/[0.02] backdrop-blur-sm">
            {[
              { value: '200+', label: 'Projects' },
              { value: '5+', label: 'Years' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-text-secondary text-xs tracking-widest uppercase mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary hover:text-accent transition-colors"
      >
        <span className="text-xs tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  )
}
