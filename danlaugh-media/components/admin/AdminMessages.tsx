'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Trash2, ChevronDown, ChevronUp, Phone } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  project_type: string
  budget_range: string
  message: string
  created_at: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('contact_messages').delete().eq('id', id)
    await fetchMessages()
    setDeletingId(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'} received
        </p>
        <button
          onClick={fetchMessages}
          className="text-xs text-text-secondary hover:text-accent transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="text-center py-20 border border-white/5 rounded-sm text-text-secondary">
          <Mail size={40} className="mx-auto mb-4 text-accent/30" />
          <p className="text-lg font-display">No messages yet</p>
          <p className="text-sm mt-1">Messages from the contact form will appear here</p>
        </div>
      )}

      {/* Messages list */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="border border-white/8 hover:border-white/15 rounded-sm overflow-hidden transition-all duration-200"
          >
            {/* Message header — always visible */}
            <div className="flex items-center gap-4 p-4 bg-white/[0.02]">
              {/* Avatar initial */}
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-accent font-display font-bold text-sm">
                  {msg.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium text-sm">{msg.name}</span>
                  <span className="text-accent text-xs px-2 py-0.5 bg-accent/10 rounded-sm border border-accent/20">
                    {msg.project_type}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-text-secondary text-xs hover:text-accent transition-colors"
                  >
                    {msg.email}
                  </a>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-text-secondary text-xs">{formatDate(msg.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`mailto:${msg.email}`}
                  className="p-1.5 text-text-secondary hover:text-accent transition-colors"
                  title="Reply via email"
                >
                  <Mail size={15} />
                </a>
                <button
                  onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  className="p-1.5 text-text-secondary hover:text-white transition-colors"
                  title="View details"
                >
                  {expandedId === msg.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={deletingId === msg.id}
                  className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  {deletingId === msg.id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />
                  }
                </button>
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === msg.id && (
              <div className="border-t border-white/5 p-4 bg-black/20 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Project Type</p>
                    <p className="text-white text-sm">{msg.project_type}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Engagement</p>
                    <p className="text-white text-sm">{msg.budget_range}</p>
                  </div>
                </div>

                {msg.message && (
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">Full Message</p>
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.03] border border-white/8 rounded-sm p-3">
                      {msg.message}
                    </p>
                  </div>
                )}

                {/* Reply button */}
                <div className="flex gap-3 pt-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: Your Project Inquiry - Danlaugh Media Production`}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-sm transition-colors"
                  >
                    <Mail size={14} />
                    Reply to {msg.name}
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
