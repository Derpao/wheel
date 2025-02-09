import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = 100; // requests per minute
const cache = new Map();

export function middleware(request: NextRequest) {
    // Get IP from headers or fallback to default
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
               
    const now = Date.now();
    const timestamps = cache.get(ip) || [];

    // Remove timestamps older than 1 minute
    const recentTimestamps = timestamps.filter((timestamp: number) => now - timestamp < 60000);

    if (recentTimestamps.length >= rateLimit) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    recentTimestamps.push(now);
    cache.set(ip, recentTimestamps);

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
}
