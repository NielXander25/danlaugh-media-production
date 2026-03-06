'use client'

import Link from 'next/link'
import { Mail, Phone, Instagram, Youtube } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-bg-secondary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="font-display font-bold text-xl text-white mb-2">
              Danlaugh Media Production
            </div>
            <p className="text-accent text-sm tracking-widest uppercase font-mono mb-4">
              Dream. Create. Capture.
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Crafting cinematic stories that move people. 
              Your vision, our artistry.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-text-secondary hover:text-accent text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="tel:08151603641"
                className="flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors"
              >
                <Phone size={14} className="text-accent" />
                08151603641
              </a>
              <a
                href="mailto:Danielchukwubuikem56@gmail.com"
                className="flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors"
              >
                <Mail size={14} className="text-accent" />
                Danielchukwubuikem56@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} Danlaugh Media Production. All rights reserved.
          </p>
          <Link
            href="/admin/login"
            className="text-text-secondary hover:text-accent text-xs transition-colors duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
