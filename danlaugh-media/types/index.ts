export interface Project {
  id: string
  title: string
  video_id: string
  thumbnail_url: string | null
  category: string
  featured: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  message: string
  avatar_url: string | null
  featured: boolean
  created_at: string
}

export interface AboutSettings {
  id: string
  image_url: string
  updated_at: string
}

export interface ContactFormData {
  name: string
  email: string
  project_type: string
  budget_range: string
  message: string
}

export type ProjectCategory = 'All' | 'Commercial' | 'Music Video' | 'Documentary' | 'Wedding' | 'Corporate' | 'Short Film'
