// TODO: Implement the code here to add rate limiting with Redis
// Refer to the Next.js Docs: https://nextjs.org/docs/app/building-your-application/routing/middleware
// Refer to Redis docs on Rate Limiting: https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Logger } from "@/app/utils/logger"

// Initialize Redis client
const redis = Redis.fromEnv();

// Create a rate limiter instance
const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"), // Allow 5 requests every 10 seconds
});

// Initialize logger instance
const logger = new Logger("RateLimiter"); 

export async function middleware(request: NextRequest) {
  try {
    // Get the client's IP address
    const ip = request.headers.get("x-forwarded-for") || '127.0.0.1'; // Fallback to localhost if IP is not available

    // Check if the request is within the rate limit
    const { success } = await rateLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // Proceed to the next middleware or route handler
    const response = NextResponse.next();

    return response;



    } catch (error) {


      logger.error("Rate limiting error:", error); 
      return NextResponse.next(); // Proceed even if there is an error
  }
}

export { redis };

    // Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
