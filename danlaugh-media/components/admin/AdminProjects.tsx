'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProjects } from '@/lib/hooks/useProjects'
import { Loader2, Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import type { Project } from '@/types'

const CATEGORIES = ['Commercial', 'Music Video', 'Documentary', 'Wedding', 'Corporate', 'Short Film']

const emptyForm = {
  title: '',
  video_id: '',
  thumbnail_url: '',
  category: 'Commercial',
  featured: false,
}

const inputClass = `
  w-full px-3 py-2 bg-white/[0.04] border border-white/8 rounded-sm
  text-white placeholder-text-secondary text-sm
  focus:outline-none focus:border-accent/60
  transition-all duration-200
`

export default function AdminProjects() {
  const { projects, loading, error, refetch } = useProjects()
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

  const startEdit = (project: Project) => {
    setForm({
      title: project.title,
      video_id: project.video_id,
      thumbnail_url: project.thumbnail_url || '',
      category: project.category,
      featured: project.featured,
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)

    try {
      const supabase = createClient()
      const payload = {
        title: form.title,
        video_id: form.video_id,
        thumbnail_url: form.thumbnail_url || null,
        category: form.category,
        featured: form.featured,
      }

      if (editingId) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert([payload])
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
    if (!confirm('Delete this project?')) return
    setDeletingId(id)
    try {
      const supabase = createClient()
      await supabase.from('projects').delete().eq('id', id)
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
    <div className="space-y-6 max-w-4xl">
      {/* Add button */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{projects.length} project(s)</p>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="p-6 bg-bg-secondary border border-white/10 rounded-sm space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <button type="button" onClick={resetForm}>
              <X size={18} className="text-text-secondary hover:text-white" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project title"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">YouTube Video ID *</label>
              <input
                required
                value={form.video_id}
                onChange={(e) => setForm({ ...form, video_id: e.target.value })}
                placeholder="e.g. dQw4w9WgXcQ"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-black">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">Custom Thumbnail URL</label>
              <input
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                placeholder="https://... (optional)"
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-accent"
            />
            <span className="text-sm text-text-secondary">Mark as featured</span>
          </label>

          {formError && (
            <p className="text-red-400 text-sm">{formError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors disabled:opacity-60"
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

      {/* List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 p-4 bg-bg-secondary border border-white/8 rounded-sm hover:border-white/15 transition-colors"
          >
            <img
              src={project.thumbnail_url || `https://img.youtube.com/vi/${project.video_id}/mqdefault.jpg`}
              alt={project.title}
              className="w-20 h-12 object-cover rounded-sm flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium truncate">{project.title}</span>
                {project.featured && <Star size={12} className="text-accent flex-shrink-0" fill="currentColor" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-text-secondary text-xs">{project.category}</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-text-secondary text-xs font-mono">{project.video_id}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => startEdit(project)}
                className="p-1.5 text-text-secondary hover:text-accent transition-colors"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
                title="Delete"
              >
                {deletingId === project.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-16 text-text-secondary border border-white/5 rounded-sm">
            No projects yet. Add your first project above.
          </div>
        )}
      </div>
    </div>
  )
}
