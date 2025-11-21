import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

/**
 * GET /[code] - Redirect to long URL
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        // Find link
        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            // Return 404 page
            return NextResponse.redirect(new URL('/404', request.url));
        }

        // Get analytics data
        const userAgent = request.headers.get('user-agent') || undefined;
        const referer = request.headers.get('referer') || undefined;
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

        // Hash IP for privacy
        const ipHash = createHash('sha256').update(ip).digest('hex');

        // Track click (async, don't wait)
        prisma.$transaction([
            prisma.link.update({
                where: { shortCode: code },
                data: {
                    clicks: { increment: 1 },
                    lastClickedAt: new Date(),
                },
            }),
            prisma.click.create({
                data: {
                    linkId: link.id,
                    userAgent,
                    referer,
                    ipHash,
                },
            }),
        ]).catch((error) => {
            console.error('Error tracking click:', error);
        });

        // Redirect (302)
        return NextResponse.redirect(link.longUrl, { status: 302 });
    } catch (error) {
        console.error('Error in redirect:', error);
        return NextResponse.redirect(new URL('/404', request.url));
    }
}
