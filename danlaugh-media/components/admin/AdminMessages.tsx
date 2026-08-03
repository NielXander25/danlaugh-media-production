'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Trash2, ChevronDown, ChevronUp, ExternalLink, RefreshCw, Inbox } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  project_type: string
  budget_range: string
  message: string
  created_at: string
}

function parseMessage(raw: string) {
  const lines = raw?.split('\n') || []
  const data: Record<string, string> = {}
  let extra = ''
  let inExtra = false

  for (const line of lines) {
    if (line.startsWith('Videos needed:')) data.videos = line.replace('Videos needed:', '').trim()
    else if (line.startsWith('Reference links:')) data.links = line.replace('Reference links:', '').trim()
    else if (line.startsWith('Engagement:')) data.engagement = line.replace('Engagement:', '').trim()
    else if (line.trim() === '') inExtra = true
    else if (inExtra && line.trim()) extra += (extra ? '\n' : '') + line
  }
  data.extra = extra
  return data
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchMessages = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
    setDeletingId(null)
    if (expandedId === id) setExpandedId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="text-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-white font-semibold">Inbox</h2>
          <p className="text-text-secondary text-xs mt-0.5">
            {messages.length} {messages.length === 1 ? 'inquiry' : 'inquiries'} received
          </p>
        </div>
        <button
          onClick={() => fetchMessages(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-white border border-white/8 hover:border-white/20 rounded-sm transition-all duration-200"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-sm bg-white/[0.01]">
          <Inbox size={40} className="text-accent/30 mb-4" />
          <p className="text-white font-display text-lg">No messages yet</p>
          <p className="text-text-secondary text-sm mt-1">
            When someone submits the contact form, it will appear here.
          </p>
        </div>
      )}

      {/* Message cards */}
      <div className="space-y-3">
        {messages.map((msg) => {
          const parsed = parseMessage(msg.message)
          const isExpanded = expandedId === msg.id
          const initials = msg.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

          return (
            <div
              key={msg.id}
              className={`rounded-sm border transition-all duration-300 overflow-hidden ${
                isExpanded
                  ? 'border-accent/30 bg-white/[0.03]'
                  : 'border-white/8 bg-white/[0.015] hover:border-white/15'
              }`}
            >
              {/* Card top row */}
              <div className="flex items-start gap-4 p-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-bold text-sm font-display">{initials}</span>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <span className="text-white font-semibold text-sm">{msg.name}</span>
                      <span className="text-text-secondary text-xs ml-2">{timeAgo(msg.created_at)}</span>
                    </div>
                    {/* Project type badge */}
                    <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded-sm flex-shrink-0">
                      {msg.project_type}
                    </span>
                  </div>

                  {/* Email */}
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-text-secondary text-xs hover:text-accent transition-colors mt-0.5 block"
                  >
                    {msg.email}
                  </a>

                  {/* Quick summary line */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {parsed.videos && (
                      <span className="text-xs text-text-secondary">
                        <span className="text-white/60">Videos:</span> {parsed.videos}
                      </span>
                    )}
                    {msg.budget_range && (
                      <span className="text-xs text-text-secondary">
                        <span className="text-white/60">Plan:</span> {msg.budget_range === 'Monthly Retainer (15% Discount)' ? 'Monthly Retainer' : 'One-Time'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                  {/* Detail grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {parsed.videos && (
                      <div className="p-3 bg-black/30 rounded-sm border border-white/5">
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Videos Needed</p>
                        <p className="text-white font-semibold">{parsed.videos}</p>
                      </div>
                    )}
                    <div className="p-3 bg-black/30 rounded-sm border border-white/5">
                      <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Engagement</p>
                      <p className="text-white font-semibold text-sm">
                        {msg.budget_range === 'Monthly Retainer (15% Discount)'
                          ? 'Monthly Retainer (-15%)'
                          : 'One-Time Package'}
                      </p>
                    </div>
                    {parsed.links && parsed.links !== 'None' && (
                      <div className="col-span-2 p-3 bg-black/30 rounded-sm border border-white/5">
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Reference Links</p>
                        <a
                          href={parsed.links}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent text-sm flex items-center gap-1 hover:underline break-all"
                        >
                          {parsed.links}
                          <ExternalLink size={11} className="flex-shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Extra message */}
                  {parsed.extra && (
                    <div className="p-3 bg-black/30 rounded-sm border border-white/5">
                      <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">Additional Notes</p>
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{parsed.extra}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Your Project Inquiry — Danlaugh Media Production`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-sm transition-colors"
                    >
                      <Mail size={14} />
                      Reply to {msg.name.split(' ')[0]}
                    </a>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-red-400 border border-white/8 hover:border-red-400/30 rounded-sm transition-all duration-200"
                    >
                      {deletingId === msg.id
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Expand / collapse footer */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-text-secondary hover:text-accent border-t border-white/5 hover:bg-white/[0.02] transition-all duration-200"
              >
                {isExpanded ? (
                  <><ChevronUp size={12} /> Collapse</>
                ) : (
                  <><ChevronDown size={12} /> View full inquiry</>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
