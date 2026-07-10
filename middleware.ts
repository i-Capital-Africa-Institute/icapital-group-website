import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.frontiertech.org; style-src 'self' 'unsafe-inline' fonts.googleapis.com api.mapbox.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob: *.frontiertech.org *.amazonaws.com img.youtube.com api.mapbox.com *.mapbox.com; connect-src 'self' *.frontiertech.org wss://icms.frontiertech.org api.mapbox.com *.mapbox.com events.mapbox.com; worker-src 'self' blob:; frame-src 'self' *.youtube.com;"
  )

  // Add caching headers based on path
  const pathname = request.nextUrl.pathname

  // Cache static assets for 1 year (immutable)
  if (pathname.match(/\.(js|css|woff2|woff|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  // Cache images for 1 year with immutable flag
  else if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|avif|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  // Cache API responses for 5 minutes with stale-while-revalidate
  else if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600')
    response.headers.set('CDN-Cache-Control', 'public, max-age=600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, max-age=600')
  }
  // Cache dynamic pages with revalidation
  else if (pathname.startsWith('/portfolios/') || pathname.startsWith('/news/')) {
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
  }
  // Cache static pages for 1 hour with stale-while-revalidate
  else if (pathname === '/' || pathname.startsWith('/eafs')) {
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600')
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600')
  }
  // Default caching for other pages
  else {
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=1800, stale-while-revalidate=3600')
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=1800')
  }

  // Add ETag support for better caching
  response.headers.set('Vary', 'Accept-Encoding')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}