import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PROJECT_ID = 'prj_p8yGrzZIdyGMBgQn9Y7wFJWnnsmU'
const MAINTENANCE_API = `https://devops-dashboard-pi.vercel.app/api/maintenance/${PROJECT_ID}`

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip maintenance check for maintenance page itself
  if (pathname === '/maintenance') {
    return NextResponse.next()
  }

  // Check maintenance status (skip for static files)
  if (!pathname.startsWith('/_next') && !pathname.includes('.')) {
    try {
      const res = await fetch(MAINTENANCE_API, { next: { revalidate: 10 } })
      const { enabled } = await res.json()
      if (enabled) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    } catch {
      // If check fails, continue normally
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
