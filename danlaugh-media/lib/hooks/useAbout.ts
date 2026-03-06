'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AboutSettings } from '@/types'

export function useAbout() {
  const [about, setAbout] = useState<AboutSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAbout = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setAbout(data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch about data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  return { about, loading, error, refetch: fetchAbout }
}
