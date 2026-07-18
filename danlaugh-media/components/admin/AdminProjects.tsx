'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProjects } from '@/lib/hooks/useProjects'
import { Loader2, Plus, Pencil, Trash2, X, Check, Star, HelpCircle } from 'lucide-react'
import type { Project } from '@/types'

const GENRES = [
  'Motion Graphics',
  'Documentary',
  'Talking Head',
  'YouTube Short Films',
  'Fashion',
  'Wedding',
  'Sports',
  'Music',
]

const emptyForm = {
  title: '',
  video_id: '',
  thumbnail_url: '',
  category: 'Motion Graphics',
  featured: false,
}

const inputClass = `
  w-full px-3 py-2 bg-white/[0.04] border border-white/8 rounded-sm
  text-white placeholder-text-secondary text-sm
  focus:outline-none focus:border-accent/60
  transition-all duration-200
`

// Detect what type of video link was pasted
function detectVideoType(url: string): string {
  if (url.includes('drive.google.com')) return 'google-drive'
  if (url.includes('vimeo.com')) return 'vimeo'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.length === 11) return 'youtube' // raw YouTube ID
  return 'unknown'
}

// Extract a usable ID or return the URL as-is
function extractVideoId(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return ytMatch[1]

  // Google Drive — store full URL, modal handles it
  if (url.includes('drive.google.com')) return url

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return vimeoMatch[1]

  // Raw ID or other — store as-is
  return url.trim()
}

// Get YouTube thumbnail from video ID
function getYoutubeThumbnail(videoId: string): string {
  if (videoId.length === 11) {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  }
  return ''
}

export default function AdminProjects() {
  const { projects, loading, refetch } = useProjects()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  const videoType = detectVideoType(form.video_id)

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

  const handleVideoUrlChange = (url: string) => {
    const id = extractVideoId(url)
    const thumb = getYoutubeThumbnail(id)
    setForm((prev) => ({
      ...prev,
      video_id: id,
      // Auto-fill YouTube thumbnail if not already set
      thumbnail_url: prev.thumbnail_url || thumb,
    }))
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

  // Group by genre for display
  const byGenre = GENRES.reduce<Record<string, Project[]>>((acc, g) => {
    acc[g] = projects.filter((p) => p.category === g)
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">{projects.length} video(s) across {GENRES.length} genres</p>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors"
        >
          <Plus size={16} />
          Add Video
        </button>
      </div>

      {/* How to add videos help box */}
      <div className="p-4 bg-accent/5 border border-accent/15 rounded-sm">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-accent text-sm font-medium w-full text-left"
        >
          <HelpCircle size={16} />
          How to add videos from YouTube / Google Drive / Vimeo
          <span className="ml-auto text-xs">{showHelp ? '▲ Hide' : '▼ Show'}</span>
        </button>

        {showHelp && (
          <div className="mt-4 space-y-3 text-text-secondary text-xs">
            <div className="p-3 bg-white/[0.03] rounded-sm border border-white/8">
              <p className="text-white font-medium mb-1">🎬 YouTube</p>
              <p>Paste the full URL: <span className="font-mono text-accent">https://youtube.com/watch?v=ABC123</span></p>
              <p className="mt-1">Or just the video ID: <span className="font-mono text-accent">ABC123</span></p>
              <p className="mt-1 text-green-400">✓ Thumbnail auto-fills from YouTube</p>
            </div>
            <div className="p-3 bg-white/[0.03] rounded-sm border border-white/8">
              <p className="text-white font-medium mb-1">📁 Google Drive</p>
              <p>1. Upload video to Google Drive</p>
              <p>2. Right-click → Share → Anyone with the link → Copy link</p>
              <p>3. Paste the full Drive URL here</p>
              <p className="mt-1 text-yellow-400">⚠ Add a custom thumbnail URL manually</p>
            </div>
            <div className="p-3 bg-white/[0.03] rounded-sm border border-white/8">
              <p className="text-white font-medium mb-1">🎥 Vimeo</p>
              <p>Paste the full URL: <span className="font-mono text-accent">https://vimeo.com/123456789</span></p>
              <p className="mt-1 text-yellow-400">⚠ Add a custom thumbnail URL manually</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="p-6 bg-bg-secondary border border-white/10 rounded-sm space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">{editingId ? 'Edit Video' : 'Add New Video'}</h3>
            <button type="button" onClick={resetForm}>
              <X size={18} className="text-text-secondary hover:text-white" />
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-text-secondary block mb-1">Video Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Nike Air Max Campaign"
              className={inputClass}
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="text-xs text-text-secondary block mb-1">
              Video URL or ID *
              {form.video_id && (
                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                  videoType === 'youtube' ? 'bg-red-500/20 text-red-400' :
                  videoType === 'google-drive' ? 'bg-blue-500/20 text-blue-400' :
                  videoType === 'vimeo' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-white/10 text-text-secondary'
                }`}>
                  {videoType === 'youtube' ? '▶ YouTube' :
                   videoType === 'google-drive' ? '📁 Google Drive' :
                   videoType === 'vimeo' ? '🎥 Vimeo' : '? Unknown'}
                </span>
              )}
            </label>
            <input
              required
              value={form.video_id}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="Paste YouTube URL, Google Drive link, or Vimeo URL"
              className={inputClass}
            />
          </div>

          {/* Genre + Thumbnail */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Genre *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-black">{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary block mb-1">
                Custom Thumbnail URL
                {videoType === 'youtube' && form.thumbnail_url && (
                  <span className="ml-1 text-green-400 text-xs">✓ Auto-filled</span>
                )}
              </label>
              <input
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                placeholder="https://... (optional for YouTube)"
                className={inputClass}
              />
            </div>
          </div>

          {/* Thumbnail preview */}
          {form.thumbnail_url && (
            <div>
              <label className="text-xs text-text-secondary block mb-1">Thumbnail Preview</label>
              <img
                src={form.thumbnail_url}
                alt="Thumbnail preview"
                className="w-40 h-24 object-cover rounded-sm border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          {/* Featured */}
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-accent"
            />
            <span className="text-sm text-text-secondary">Mark as featured</span>
          </label>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {editingId ? 'Update Video' : 'Add Video'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm text-text-secondary hover:text-white border border-white/10 rounded-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects grouped by genre */}
      <div className="space-y-8">
        {GENRES.map((genre) => {
          const genreProjects = byGenre[genre]
          if (genreProjects.length === 0) return null
          return (
            <div key={genre}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1 h-4 bg-accent rounded-full" />
                <h4 className="text-white font-semibold text-sm">{genre}</h4>
                <span className="text-text-secondary text-xs font-mono">{genreProjects.length}</span>
              </div>
              <div className="space-y-2">
                {genreProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/8 rounded-sm hover:border-white/15 transition-colors"
                  >
                    <img
                      src={project.thumbnail_url || `https://img.youtube.com/vi/${project.video_id}/mqdefault.jpg`}
                      alt={project.title}
                      className="w-20 h-12 object-cover rounded-sm flex-shrink-0 bg-white/5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="48"%3E%3Crect width="80" height="48" fill="%23111"/%3E%3C/svg%3E'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium truncate">{project.title}</span>
                        {project.featured && (
                          <Star size={11} className="text-accent flex-shrink-0" fill="currentColor" />
                        )}
                      </div>
                      <span className="text-text-secondary text-xs font-mono truncate block mt-0.5">
                        {project.video_id.length > 40 ? project.video_id.slice(0, 40) + '…' : project.video_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEdit(project)}
                        className="p-1.5 text-text-secondary hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        {deletingId === project.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {projects.length === 0 && (
          <div className="text-center py-16 text-text-secondary border border-white/5 rounded-sm">
            No videos yet. Click "Add Video" to get started.
          </div>
        )}
      </div>
    </div>
  )
}
