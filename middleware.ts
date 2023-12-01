import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {env} from "./env.mjs";

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-db-version', String(env.DATABASE_VERSION))

  // You can also set request headers
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })

  // Set a new response header
  response.headers.set('x-db-version', String(env.DATABASE_VERSION))
  return response
}