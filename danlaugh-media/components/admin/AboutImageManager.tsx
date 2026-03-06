'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAbout } from '@/lib/hooks/useAbout'
import { Loader2, Save, ImageIcon, CheckCircle, ExternalLink } from 'lucide-react'
import Image from 'next/image'

export default function AboutImageManager() {
  const { about, loading, refetch } = useAbout()
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (about?.image_url) {
      setImageUrl(about.image_url)
    }
  }, [about])

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
          .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
          .eq('id', about.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('about')
          .insert([{ image_url: imageUrl }])
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
        <h2 className="text-white font-semibold mb-1">About Section Image</h2>
        <p className="text-text-secondary text-sm">
          Update the profile image displayed in the About section of the homepage.
        </p>
      </div>

      {/* Preview */}
      <div className="p-6 bg-bg-secondary border border-white/8 rounded-sm">
        <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4">Current Image</h3>
        <div className="aspect-[4/5] max-w-xs relative overflow-hidden rounded-sm bg-white/[0.03] border border-white/8">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="About preview"
              fill
              className="object-cover"
              sizes="300px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary gap-3">
              <ImageIcon size={32} />
              <span className="text-sm">No image set</span>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 bg-bg-secondary border border-white/8 rounded-sm space-y-4">
        <div>
          <label className="block text-xs text-text-secondary uppercase tracking-wider mb-2">
            Image URL *
          </label>
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/your-photo.jpg"
            className="w-full px-4 py-3 bg-white/[0.04] border border-white/8 rounded-sm text-white placeholder-text-secondary text-sm focus:outline-none focus:border-accent/60 input-glow transition-all duration-200"
          />
          <p className="text-text-secondary text-xs mt-2">
            Use a direct image URL (Supabase Storage, Cloudinary, Unsplash, etc.)
          </p>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !imageUrl}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />Saving...</>
            ) : success ? (
              <><CheckCircle size={14} />Saved!</>
            ) : (
              <><Save size={14} />Save Image</>
            )}
          </button>

          {imageUrl && (
            <a
              href={imageUrl}
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

      <div className="p-4 bg-accent/5 border border-accent/15 rounded-sm">
        <h4 className="text-accent text-sm font-medium mb-2">💡 Tips</h4>
        <ul className="text-text-secondary text-xs space-y-1">
          <li>• Upload your image to Supabase Storage and use the public URL</li>
          <li>• Recommended: Portrait orientation (4:5 ratio), min 800×1000px</li>
          <li>• Changes reflect instantly on the homepage after saving</li>
        </ul>
      </div>
    </div>
  )
}
