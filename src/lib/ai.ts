import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateCustomCode } from './base62';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate AI-powered short code suggestions
 */
export async function generateAISuggestions(longUrl: string): Promise<string[]> {
    try {
        const prompt = `Analyze this URL and suggest 3 memorable short codes (6-8 characters, alphanumeric only):
URL: ${longUrl}

Consider:
- Domain name
- Path segments
- Common abbreviations
- Memorability

Return ONLY a JSON array of 3 suggestions, nothing else. Example: ["code1", "code2", "code3"]`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response
        const jsonMatch = response.match(/\[.*\]/);
        if (!jsonMatch) return [];

        const suggestions = JSON.parse(jsonMatch[0]) as string[];

        // Filter valid codes
        return suggestions.filter(validateCustomCode).slice(0, 3);
    } catch (error) {
        console.error('AI suggestion error:', error);
        return [];
    }
}

/**
 * Categorize URL using AI
 */
export async function categorizeUrl(longUrl: string): Promise<string | null> {
    try {
        const prompt = `Analyze this URL and categorize it into ONE of the following categories:

URL: ${longUrl}

Categories:
- News: News websites, blogs, journalism sites
- E-commerce: Online stores, shopping sites, product pages
- Documentation: Technical docs, API references, guides, tutorials
- Social Media: Facebook, Twitter, Instagram, LinkedIn, TikTok, etc.
- Entertainment: Streaming, gaming, movies, music, videos
- Education: Online courses, schools, universities, learning platforms
- Business: Corporate sites, B2B services, professional services
- Technology: Tech companies, software, hardware, developer tools
- Other: Anything that doesn't fit the above categories

Return ONLY the category name, nothing else. Be specific and accurate.`;

        const result = await model.generateContent(prompt);
        const category = result.response.text().trim();

        const validCategories = [
            'News', 'E-commerce', 'Documentation', 'Social Media',
            'Entertainment', 'Education', 'Business', 'Technology', 'Other'
        ];

        return validCategories.includes(category) ? category : 'Other';
    } catch (error) {
        console.error('AI categorization error:', error);
        return null;
    }
}

/**
 * Validate URL security using AI and heuristics
 */
export async function validateUrlSecurity(longUrl: string): Promise<{
    safe: boolean;
    score: number;
    reason?: string;
}> {
    try {
        // Calculate base score using heuristics
        let score = 0;
        const url = new URL(longUrl);

        // HTTPS check (+20 points)
        if (url.protocol === 'https:') {
            score += 20;
        }

        // Known safe domains (+25 points)
        const safeDomains = [
            'google.com', 'github.com', 'stackoverflow.com', 'microsoft.com',
            'amazon.com', 'apple.com', 'facebook.com', 'twitter.com', 'linkedin.com',
            'youtube.com', 'wikipedia.org', 'reddit.com', 'medium.com', 'dev.to',
            'vercel.app', 'netlify.app', 'nextjs.org', 'reactjs.org', 'nodejs.org'
        ];

        const hostname = url.hostname.toLowerCase();
        const isSafeDomain = safeDomains.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );

        if (isSafeDomain) {
            score += 25;
        } else {
            score += 10; // Partial points for unknown domains
        }

        // URL length check (+15 points if reasonable)
        if (longUrl.length < 200) {
            score += 15;
        } else if (longUrl.length < 500) {
            score += 10;
        } else {
            score += 5;
        }

        // No suspicious patterns (+20 points)
        const suspiciousPatterns = [
            /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP addresses
            /bit\.ly|tinyurl|shorturl/i, // URL shorteners
            /login|signin|verify|account|secure|update/i, // Phishing keywords
            /%[0-9a-f]{2}/gi, // URL encoding
        ];

        const hasSuspiciousPattern = suspiciousPatterns.some(pattern =>
            pattern.test(longUrl)
        );

        if (!hasSuspiciousPattern) {
            score += 20;
        } else {
            score += 5;
        }

        // Domain structure (+10 points for clean domain)
        const domainParts = hostname.split('.');
        if (domainParts.length <= 3) {
            score += 10;
        } else if (domainParts.length <= 4) {
            score += 5;
        }

        // Path complexity (+10 points for simple paths)
        const pathSegments = url.pathname.split('/').filter(Boolean);
        if (pathSegments.length <= 3) {
            score += 10;
        } else if (pathSegments.length <= 5) {
            score += 5;
        }

        // Ensure score is between 0-100
        score = Math.min(100, Math.max(0, score));

        // Use AI for additional validation if score is borderline
        if (score < 70) {
            try {
                const prompt = `Analyze this URL for security risks:\nURL: ${longUrl}\n\nCheck for:\n- Phishing patterns\n- Suspicious domains\n- URL obfuscation\n- Known malicious patterns\n\nReturn ONLY a JSON object: {\"safe\": true/false, \"score\": 0-100, \"reason\": \"brief explanation\"}`;

                const result = await model.generateContent(prompt);
                const response = result.response.text();
                const jsonMatch = response.match(/\{[\s\S]*\}/);

                if (jsonMatch) {
                    const aiData = JSON.parse(jsonMatch[0]);
                    // Blend heuristic and AI scores
                    score = Math.round((score + (aiData.score ?? score)) / 2);
                    return {
                        safe: aiData.safe ?? (score >= 50),
                        score,
                        reason: aiData.reason
                    };
                }
            } catch (aiError) {
                console.error('AI security check failed, using heuristic score:', aiError);
            }
        }

        return {
            safe: score >= 50,
            score,
            reason: score < 50 ? 'URL contains suspicious patterns' : undefined
        };
    } catch (error) {
        console.error('Security validation error:', error);
        return { safe: true, score: 50 }; // Neutral score on error
    }
}

/**
 * Generate analytics insights using AI
 */
export async function generateInsights(stats: {
    clicks: number;
    createdAt: Date;
    lastClickedAt?: Date | null;
    recentClicks?: number[];
}): Promise<string[]> {
    try {
        const daysSinceCreation = Math.floor(
            (Date.now() - stats.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        const prompt = `Generate 3 brief, actionable insights from this link analytics:
- Total clicks: ${stats.clicks}
- Days since creation: ${daysSinceCreation}
- Last clicked: ${stats.lastClickedAt ? new Date(stats.lastClickedAt).toLocaleDateString() : 'Never'}
- Recent daily clicks: ${stats.recentClicks?.join(', ') || 'N/A'}

Return ONLY a JSON array of 3 brief insights (max 15 words each). Example:
["insight 1", "insight 2", "insight 3"]`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response
        const jsonMatch = response.match(/\[.*\]/);
        if (!jsonMatch) return [];

        const insights = JSON.parse(jsonMatch[0]) as string[];
        return insights.slice(0, 3);
    } catch (error) {
        console.error('AI insights error:', error);
        return [];
    }
}
