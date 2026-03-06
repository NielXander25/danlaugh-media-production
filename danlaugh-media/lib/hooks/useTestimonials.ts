'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/types'

export function useTestimonials(featuredOnly = false) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (featuredOnly) {
        query = query.eq('featured', true)
      }

      const { data, error } = await query
      if (error) throw error
      setTestimonials(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [featuredOnly])

  return { testimonials, loading, error, refetch: fetchTestimonials }
}
