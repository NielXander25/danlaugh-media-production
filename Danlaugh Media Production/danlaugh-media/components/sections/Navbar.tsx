'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCount = useRef(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Double-click on logo → navigate to /admin/login
  const handleLogoClick = () => {
    clickCount.current += 1
    if (clickCount.current === 1) {
      // Single click: scroll to top after short wait to check for double-click
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 280)
    } else if (clickCount.current === 2) {
      // Double click: go to admin login
      if (clickTimer.current) clearTimeout(clickTimer.current)
      clickCount.current = 0
      router.push('/admin/login')
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo — single click scrolls to top, double-click → /admin/login */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group select-none"
            aria-label="Danlaugh Media Production"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-accent/30 group-hover:ring-accent/60 transition-all duration-300">
              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                {/* Placeholder for actual logo - replace with your Image component */}
                <span className="text-accent font-display font-bold text-sm">DL</span>
              </div>
            </div>
            <div>
              <span className="font-display font-semibold text-white text-sm leading-tight block">
                Danlaugh
              </span>
              <span className="text-text-secondary text-xs tracking-widest uppercase leading-tight block">
                Media Production
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-text-secondary hover:text-white text-sm font-body transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <button
              onClick={() => handleNavClick('#contact')}
              className="px-5 py-2 text-sm font-medium bg-accent hover:bg-accent-hover text-white rounded-sm transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/20"
            >
              Get In Touch
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleNavClick(link.href)}
                className="font-display text-3xl text-white hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.07 }}
              onClick={() => handleNavClick('#contact')}
              className="mt-4 px-8 py-3 bg-accent text-white font-medium rounded-sm text-lg"
            >
              Get In Touch
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}