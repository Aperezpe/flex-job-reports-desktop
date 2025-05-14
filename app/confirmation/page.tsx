'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Status = 'loading' | 'success' | 'expired' | 'error'

export default function ConfirmationPage() {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const fragment = window.location.hash.substring(1) // Remove the leading '#'
    const params = new URLSearchParams(fragment)

    const accessToken = params.get('access_token')
    const errorCode = params.get('error_code')

    if (errorCode === 'otp_expired') {
      setStatus('expired')
    } else if (accessToken) {
      supabase.auth.getUser(accessToken).then(({ data, error }) => {
        if (error || !data.user) {
          setStatus('error')
        } else {
          setStatus('success')
        }
      })
    } else {
      setStatus('error')
    }
  }, [])

  if (status === 'loading') return <p>Verifying your email…</p>
  if (status === 'success') return <p>✅ Email verified successfully! You can return to the app.</p>
  if (status === 'expired') return <p>⚠️ This link has expired. Please request a new verification email.</p>
  return <p>❌ Something went wrong. Please try again.</p>
}
