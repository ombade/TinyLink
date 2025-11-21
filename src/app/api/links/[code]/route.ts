import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInsights } from '@/lib/ai';

/**
 * GET /api/links/[code] - Get link stats
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        const link = await prisma.link.findUnique({
            where: { shortCode: code },
            include: {
                clicks_detail: {
                    take: 100,
                    orderBy: { clickedAt: 'desc' },
                },
            },
        });

        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        // Get click statistics
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const recentClicks = await prisma.click.groupBy({
            by: ['clickedAt'],
            where: {
                linkId: link.id,
                clickedAt: { gte: last7Days },
            },
            _count: true,
        });

        // Generate AI insights
        const insights = await generateInsights({
            clicks: link.clicks,
            createdAt: link.createdAt,
            lastClickedAt: link.lastClickedAt,
            recentClicks: recentClicks.map((c) => c._count),
        }).catch(() => []);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        return NextResponse.json({
            shortCode: link.shortCode,
            shortUrl: `${baseUrl}/${link.shortCode}`,
            longUrl: link.longUrl,
            clicks: link.clicks,
            lastClickedAt: link.lastClickedAt,
            category: link.category,
            securityScore: link.securityScore,
            createdAt: link.createdAt,
            insights,
            recentActivity: recentClicks.length,
            clicks_detail: link.clicks_detail,
        });
    } catch (error) {
        console.error('Error fetching link stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/links/[code] - Delete a link
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        });

        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        await prisma.link.delete({
            where: { shortCode: code },
        });

        return NextResponse.json(
            { message: 'Link deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
