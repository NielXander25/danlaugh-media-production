'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTestimonials } from '@/lib/hooks/useTestimonials'
import { Loader2, Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import type { Testimonial } from '@/types'

const emptyForm = {
  name: '',
  role: '',
  company: '',
  message: '',
  avatar_url: '',
  featured: false,
}

const inputClass = `
  w-full px-3 py-2 bg-white/[0.04] border border-white/8 rounded-sm
  text-white placeholder-text-secondary text-sm
  focus:outline-none focus:border-accent/60
  transition-all duration-200
`

export default function AdminTestimonials() {
  const { testimonials, loading, refetch } = useTestimonials()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    setFormError(null)
  }

  const startEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      role: t.role,
      company: t.company,
      message: t.message,
      avatar_url: t.avatar_url || '',
      featured: t.featured,
    })
    setEditingId(t.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)

    try {
      const supabase = createClient()
      const payload = {
        name: form.name,
        role: form.role,
        company: form.company,
        message: form.message,
        avatar_url: form.avatar_url || null,
        featured: form.featured,
      }

      if (editingId) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('testimonials').insert([payload])
        if (error) throw error
      }

      await refetch()
      resetForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    setDeletingId(id)
    try {
      const supabase = createClient()
      await supabase.from('testimonials').delete().eq('id', id)
      await refetch()
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{testimonials.length} testimonial(s)</p>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors"
        >
          <Plus size={16} />
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          className="p-6 bg-bg-secondary border border-white/10 rounded-sm space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <button type="button" onClick={resetForm}>
              <X size={18} className="text-text-secondary hover:text-white" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Client name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">Role *</label>
              <input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. CEO"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">Avatar URL</label>
              <input
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                placeholder="https://... (optional)"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-secondary block mb-1">Message *</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Client testimonial..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-accent"
            />
            <span className="text-sm text-text-secondary">Show on homepage (featured)</span>
          </label>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-text-secondary hover:text-white border border-white/10 rounded-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-4 p-4 bg-bg-secondary border border-white/8 rounded-sm hover:border-white/15 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">{t.name}</span>
                {t.featured && <Star size={12} className="text-accent" fill="currentColor" />}
              </div>
              <div className="text-text-secondary text-xs mt-0.5">{t.role}{t.company ? `, ${t.company}` : ''}</div>
              <p className="text-text-secondary text-xs mt-2 line-clamp-2 italic">"{t.message}"</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => startEdit(t)} className="p-1.5 text-text-secondary hover:text-accent transition-colors">
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
              >
                {deletingId === t.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-16 text-text-secondary border border-white/5 rounded-sm">
            No testimonials yet.
          </div>
        )}
      </div>
    </div>
  )
}
