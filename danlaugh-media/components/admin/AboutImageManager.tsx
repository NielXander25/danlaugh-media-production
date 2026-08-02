'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAbout } from '@/lib/hooks/useAbout'
import { Loader2, Save, CheckCircle, ExternalLink, Film } from 'lucide-react'

function getMediaType(url: string): 'video' | 'gif' | 'image' | null {
  if (!url) return null
  const lower = url.toLowerCase()
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) return 'video'
  if (lower.endsWith('.gif')) return 'gif'
  if (lower.match(/\.(jpg|jpeg|png|webp|avif|svg)$/)) return 'image'
  return null
}

export default function AboutImageManager() {
  const { about, loading, refetch } = useAbout()
  const [mediaUrl, setMediaUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (about?.image_url) setMediaUrl(about.image_url)
  }, [about])

  const mediaType = getMediaType(mediaUrl)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      if (about?.id) {
        const { error } = await supabase
          .from('about')
          .update({ image_url: mediaUrl, updated_at: new Date().toISOString() })
          .eq('id', about.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('about')
          .insert([{ image_url: mediaUrl }])
        if (error) throw error
      }
      await refetch()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-white font-semibold mb-1">About Section Media</h2>
        <p className="text-text-secondary text-sm">
          Upload your animated logo or profile image. Supports MP4, WebM, GIF, PNG, JPG.
        </p>
      </div>

      {/* Preview */}
      <div className="p-6 bg-bg-secondary border border-white/8 rounded-sm">
        <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4">Current Media</h3>
        <div className="aspect-[4/5] max-w-xs relative overflow-hidden rounded-sm bg-white/[0.03] border border-white/8">
          {mediaUrl ? (
            mediaType === 'video' ? (
              <video
                src={mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={mediaUrl}
                alt="About preview"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )
          ) : (
            /* Default local animated logo */
            <video
              src="/logo-animated.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {mediaType && (
          <p className="text-text-secondary text-xs mt-3">
            Detected type: <span className="text-accent font-mono">{mediaType}</span>
            {mediaType === 'video' && ' — will autoplay, loop, and mute automatically'}
            {mediaType === 'gif' && ' — will animate automatically'}
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 bg-bg-secondary border border-white/8 rounded-sm space-y-4">
        <div>
          <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
            Media URL *
          </label>
          <input
            type="url"
            required
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://example.com/logo-animated.mp4"
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/8 rounded-sm text-white placeholder-text-secondary text-sm focus:outline-none focus:border-accent/60 transition-all duration-200"
          />
          <p className="text-text-secondary text-xs mt-2">
            Supported: <span className="font-mono text-accent">.mp4 .webm .gif .png .jpg</span>
          </p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !mediaUrl}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />Saving...</>
            ) : success ? (
              <><CheckCircle size={14} />Saved!</>
            ) : (
              <><Save size={14} />Save Media</>
            )}
          </button>

          {mediaUrl && (
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-white transition-colors"
            >
              <ExternalLink size={14} />
              Preview URL
            </a>
          )}
        </div>
      </form>

      <div className="p-4 bg-accent/5 border border-accent/15 rounded-sm space-y-2">
        <h4 className="text-accent text-sm font-medium">💡 How to use your animated logo</h4>
        <ol className="text-text-secondary text-xs space-y-1 list-decimal list-inside">
          <li>Upload your <span className="font-mono text-white">logo-animated.mp4</span> to the <span className="font-mono text-white">public/</span> folder in GitHub</li>
          <li>It will automatically show by default in the About section</li>
          <li>To use a different hosted URL, paste it above and save</li>
          <li>MP4 and WebM files will autoplay, loop silently — perfect for animated logos</li>
        </ol>
      </div>
    </div>
  )
}
