import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, project_type, budget_range, message } = body

    if (!name || !email || !project_type || !budget_range) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    // Save to Supabase
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, project_type, budget_range, message }])

    if (dbError) throw dbError

    // Send email notification to owner via a simple fetch to a mailto-compatible service
    // Using Resend (free tier: 100 emails/day) — add RESEND_API_KEY to Vercel env vars
    // If no RESEND_API_KEY is set, we skip email but still save to DB
    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Danlaugh Website <onboarding@resend.dev>',
          to: ['Danielchukwubuikem56@gmail.com'],
          subject: `New Project Inquiry from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f0f0f; color: #fff; border-radius: 8px;">
              <h2 style="color: #16A34A; margin-bottom: 24px;">New Project Inquiry</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #222;">
                  <td style="padding: 12px 0; color: #A3A3A3; width: 140px;">Name</td>
                  <td style="padding: 12px 0; color: #fff; font-weight: bold;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #222;">
                  <td style="padding: 12px 0; color: #A3A3A3;">Email</td>
                  <td style="padding: 12px 0; color: #fff;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #222;">
                  <td style="padding: 12px 0; color: #A3A3A3;">Project Type</td>
                  <td style="padding: 12px 0; color: #16A34A; font-weight: bold;">${project_type}</td>
                </tr>
                <tr style="border-bottom: 1px solid #222;">
                  <td style="padding: 12px 0; color: #A3A3A3;">Engagement</td>
                  <td style="padding: 12px 0; color: #fff;">${budget_range}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #A3A3A3; vertical-align: top;">Message</td>
                  <td style="padding: 12px 0; color: #fff; white-space: pre-wrap;">${message || 'No additional message'}</td>
                </tr>
              </table>

              <div style="margin-top: 32px; padding: 16px; background: #16A34A22; border: 1px solid #16A34A44; border-radius: 6px;">
                <p style="margin: 0; color: #A3A3A3; font-size: 13px;">
                  Reply directly to this email to respond to <strong style="color: #fff;">${name}</strong> at <a href="mailto:${email}" style="color: #16A34A;">${email}</a>
                </p>
              </div>

              <p style="margin-top: 24px; color: #555; font-size: 12px;">Sent from Danlaugh Media Production website</p>
            </div>
          `,
          reply_to: email,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 })
  }
}
