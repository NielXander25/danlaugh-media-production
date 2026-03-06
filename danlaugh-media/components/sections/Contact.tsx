'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Send, CheckCircle, Loader2, MessageCircle } from 'lucide-react'
import type { ContactFormData } from '@/types'

const PROJECT_TYPES = ['Commercial Video', 'Music Video', 'Documentary', 'Wedding Film', 'Corporate Video', 'Short Film', 'Other']
const BUDGET_RANGES = ['Under ₦100k', '₦100k–₦300k', '₦300k–₦500k', '₦500k–₦1M', 'Above ₦1M', 'Let\'s Discuss']

const inputClass = `
  w-full px-4 py-3 bg-white/[0.04] border border-white/8 rounded-sm
  text-white placeholder-text-secondary text-sm
  focus:outline-none focus:border-accent/60 input-glow
  transition-all duration-300
`

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    project_type: '',
    budget_range: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSuccess(true)
      setForm({ name: '', email: '', project_type: '', budget_range: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSubmitting(false)
    }
  }

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, ease: 'easeInOut', delay },
  })

  return (
    <section id="contact" ref={ref} className="section-padding bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/3 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-accent" />
            <span className="text-accent text-xs font-mono tracking-[0.3em] uppercase">Get In Touch</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">Start a Project</h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: Info */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-2 space-y-8">
            <p className="text-text-secondary leading-relaxed">
              Ready to bring your vision to life? Tell us about your project and 
              let&apos;s create something extraordinary together.
            </p>

            <div className="space-y-4">
              <a
                href="tel:08151603641"
                className="flex items-center gap-4 p-4 border border-white/8 hover:border-accent/25 rounded-sm transition-all duration-300 group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 group-hover:bg-accent/15 rounded-sm transition-colors">
                  <Phone size={16} className="text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider mb-0.5">WhatsApp / Call</div>
                  <div className="text-white font-medium">08151603641</div>
                </div>
              </a>

              <a
                href="mailto:Danielchukwubuikem56@gmail.com"
                className="flex items-center gap-4 p-4 border border-white/8 hover:border-accent/25 rounded-sm transition-all duration-300 group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 group-hover:bg-accent/15 rounded-sm transition-colors">
                  <Mail size={16} className="text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider mb-0.5">Email</div>
                  <div className="text-white font-medium text-sm">Danielchukwubuikem56@gmail.com</div>
                </div>
              </a>

              <a
                href="https://wa.me/2348151603641"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-accent/10 hover:bg-accent/15 border border-accent/20 hover:border-accent/40 rounded-sm transition-all duration-300 group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-accent/20 rounded-sm">
                  <MessageCircle size={16} className="text-accent" />
                </div>
                <div>
                  <div className="text-xs text-accent/70 uppercase tracking-wider mb-0.5">Chat Now</div>
                  <div className="text-white font-medium">WhatsApp Direct</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-3">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-20 text-center border border-white/8 rounded-sm"
              >
                <CheckCircle size={48} className="text-accent mb-4" />
                <h3 className="font-display text-2xl text-white mb-2">Message Sent!</h3>
                <p className="text-text-secondary">We&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2.5 border border-white/10 hover:border-accent/30 text-sm text-text-secondary hover:text-white rounded-sm transition-all duration-300"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    required
                    value={form.project_type}
                    onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                    className={`${inputClass} text-${form.project_type ? 'white' : 'text-secondary'}`}
                  >
                    <option value="" disabled>Project Type</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-black">{t}</option>
                    ))}
                  </select>

                  <select
                    required
                    value={form.budget_range}
                    onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
                    className={inputClass}
                  >
                    <option value="" disabled>Budget Range</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b} value={b} className="bg-black">{b}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Tell us about your project..."
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                />

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-sm transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
