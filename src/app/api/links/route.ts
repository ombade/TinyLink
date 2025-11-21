import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateShortCode, validateCustomCode, validateUrl } from '@/lib/base62';
import { categorizeUrl, validateUrlSecurity, generateAISuggestions } from '@/lib/ai';
import { z } from 'zod';

// Request validation schema
const createLinkSchema = z.object({
    longUrl: z.string().url('Invalid URL format'),
    customCode: z.string().optional(),
});

/**
 * POST /api/links - Create a new short link
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        const validation = createLinkSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { longUrl, customCode } = validation.data;

        // Validate URL
        if (!validateUrl(longUrl)) {
            return NextResponse.json(
                { error: 'Invalid URL. Must be a valid HTTP or HTTPS URL.' },
                { status: 400 }
            );
        }

        // Check if URL already exists
        const existing = await prisma.link.findFirst({
            where: { longUrl },
        });

        if (existing) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            return NextResponse.json({
                shortCode: existing.shortCode,
                shortUrl: `${baseUrl}/${existing.shortCode}`,
                longUrl: existing.longUrl,
                category: existing.category,
                message: 'URL already shortened',
            });
        }

        // Determine short code
        let shortCode: string;
        let aiSuggested = false;

        if (customCode) {
            // Validate custom code
            if (!validateCustomCode(customCode)) {
                return NextResponse.json(
                    { error: 'Custom code must be 6-8 alphanumeric characters' },
                    { status: 400 }
                );
            }

            // Check if custom code already exists
            const codeExists = await prisma.link.findUnique({
                where: { shortCode: customCode },
            });

            if (codeExists) {
                return NextResponse.json(
                    { error: `Short code '${customCode}' already exists` },
                    { status: 409 }
                );
            }

            shortCode = customCode;
        } else {
            // Generate short code
            shortCode = generateShortCode();
            aiSuggested = true;

            // Ensure uniqueness (retry if collision)
            let attempts = 0;
            while (attempts < 5) {
                const exists = await prisma.link.findUnique({
                    where: { shortCode },
                });

                if (!exists) break;

                shortCode = generateShortCode();
                attempts++;
            }

            if (attempts === 5) {
                return NextResponse.json(
                    { error: 'Failed to generate unique short code. Please try again.' },
                    { status: 500 }
                );
            }
        }

        // AI Features (run in parallel)
        const [category, securityCheck, aiSuggestions] = await Promise.all([
            categorizeUrl(longUrl).catch(() => null),
            validateUrlSecurity(longUrl).catch(() => ({ safe: true, score: 75, reason: undefined })),
            generateAISuggestions(longUrl).catch(() => []),
        ]);

        // Check security
        if (!securityCheck.safe) {
            return NextResponse.json(
                {
                    error: 'URL failed security check',
                    reason: securityCheck.reason,
                    score: securityCheck.score
                },
                { status: 400 }
            );
        }

        // Create link
        const link = await prisma.link.create({
            data: {
                shortCode,
                longUrl,
                category,
                aiSuggested,
                securityScore: securityCheck.score,
            },
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        return NextResponse.json(
            {
                shortCode: link.shortCode,
                shortUrl: `${baseUrl}/${link.shortCode}`,
                longUrl: link.longUrl,
                category: link.category,
                securityScore: link.securityScore,
                aiSuggestions: aiSuggestions.length > 0 ? aiSuggestions : undefined,
                createdAt: link.createdAt,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/links - List all links
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { shortCode: { contains: search, mode: 'insensitive' } },
                { longUrl: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category && category !== 'All') {
            where.category = category;
        }

        const [links, total] = await Promise.all([
            prisma.link.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    shortCode: true,
                    longUrl: true,
                    clicks: true,
                    lastClickedAt: true,
                    category: true,
                    securityScore: true,
                    createdAt: true,
                },
            }),
            prisma.link.count({ where }),
        ]);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const linksWithUrls = links.map((link) => ({
            ...link,
            shortUrl: `${baseUrl}/${link.shortCode}`,
        }));

        return NextResponse.json({
            links: linksWithUrls,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
