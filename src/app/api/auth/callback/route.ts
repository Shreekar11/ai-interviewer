import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../../supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}`)
      } else {
        return NextResponse.redirect(`${origin}`)
      }
    }
  }

  return NextResponse.redirect(`${process.env.SITE_URL}/onboarding?code=${code}`);
}