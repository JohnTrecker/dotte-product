import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  let email: string

  try {
    const body = await request.json()
    email = body?.email
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500 },
    )
  }

  if (!audienceId) {
    return NextResponse.json(
      { error: 'Audience not configured' },
      { status: 500 },
    )
  }

  const resend = new Resend(apiKey)

  try {
    await resend.contacts.create({
      email: email.trim().toLowerCase(),
      audienceId,
      unsubscribed: false,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend API error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 },
    )
  }
}
