'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Phone, Send, CheckCircle, Loader2, MessageCircle } from 'lucide-react'

const SERVICE_TYPES = [
  'Standard Video Editing',
  'Motion Graphics',
  'Documentary',
  'Talking Head',
  'YouTube Short Films',
  'Fashion',
  'Wedding Film',
  'Sports',
  'Music Video',
  'Animation',
]

const ENGAGEMENT_TYPES = [
  'One-Time Package / Single Order',
  'Monthly Retainer (15% Discount)',
]

const inputClass = `
  w-full px-4 py-3 bg-white/[0.04] border border-white/8 rounded-sm
  text-white placeholder-text-secondary text-sm
  focus:outline-none focus:border-accent/60 input-glow
  transition-all duration-300
`

const labelClass = 'block text-white font-semibold text-sm mb-3'

interface FormData {
  name: string
  email: string
  service_type: string
  video_count: string
  reference_links: string
  engagement_type: string
  message: string
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    service_type: '',
    video_count: '1',
    reference_links: '',
    engagement_type: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.service_type) { setError('Please select a service type'); return }
    if (!form.engagement_type) { setError('Please select how you want to work together'); return }
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          project_type: form.service_type,
          budget_range: form.engagement_type,
          message: `Videos needed: ${form.video_count}\nReference links: ${form.reference_links || 'None'}\nEngagement: ${form.engagement_type}\n\n${form.message}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSuccess(true)
      setForm({ name: '', email: '', service_type: '', video_count: '1', reference_links: '', engagement_type: '', message: '' })
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
          {/* Left: contact info */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-2 space-y-8">
            <p className="text-text-secondary leading-relaxed">
              Ready to bring your vision to life? Answer a few quick questions and
              let&apos;s create something extraordinary together.
            </p>

            <div className="space-y-4">
              <a
                href="tel:08141603641"
                className="flex items-center gap-4 p-4 border border-white/8 hover:border-accent/25 rounded-sm transition-all duration-300 group"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 group-hover:bg-accent/15 rounded-sm transition-colors">
                  <Phone size={16} className="text-accent" />
                </div>
                <div>
                  <div className="text-xs text-text-secondary uppercase tracking-wider mb-0.5">WhatsApp / Call</div>
                  <div className="text-white font-medium">08141603641</div>
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
                href="https://wa.me/2348141603641"
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
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Q1: Service type */}
                <div>
                  <label className={labelClass}>What type of project are we building? *</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, service_type: type })}
                        className={`px-4 py-2 text-sm rounded-sm border transition-all duration-200 ${
                          form.service_type === type
                            ? 'bg-accent border-accent text-white'
                            : 'border-white/10 text-text-secondary hover:border-accent/40 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Video count */}
                <div>
                  <label className={labelClass}>How many videos do you need? *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.video_count}
                    onChange={(e) => setForm({ ...form, video_count: e.target.value })}
                    className={`${inputClass} max-w-xs`}
                  />
                </div>

                {/* Q3: Reference links */}
                <div>
                  <label className={labelClass}>
                    Paste links to any reference videos or visual styles you like:
                    <span className="text-text-secondary font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.reference_links}
                    onChange={(e) => setForm({ ...form, reference_links: e.target.value })}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>

                {/* Q4: Engagement type */}
                <div>
                  <label className={labelClass}>How would you like to work together? *</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {ENGAGEMENT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, engagement_type: type })}
                        className={`flex-1 px-4 py-3 text-sm rounded-sm border text-left transition-all duration-200 ${
                          form.engagement_type === type
                            ? 'bg-accent border-accent text-white'
                            : 'border-white/10 text-text-secondary hover:border-accent/40 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional message */}
                <div>
                  <label className={labelClass}>
                    Anything else you&apos;d like us to know?
                    <span className="text-text-secondary font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more about your vision, timeline, or any specific requirements..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-sm transition-all duration-300 hover:-translate-y-px hover:shadow-lg hover:shadow-accent/20"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" />Sending...</>
                  ) : (
                    <><Send size={16} />Submit &rarr;</>
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
