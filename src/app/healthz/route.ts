import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /healthz - Health check endpoint
 */
export async function GET() {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        // Check AI service (optional)
        const aiAvailable = !!process.env.GEMINI_API_KEY;

        return NextResponse.json({
            ok: true,
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            database: 'connected',
            ai: aiAvailable ? 'available' : 'unavailable',
            uptime: process.uptime(),
        });
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                error: 'Database connection failed',
            },
            { status: 500 }
        );
    }
}
