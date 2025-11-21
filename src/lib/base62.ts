/**
 * Base62 encoding for URL shortening
 * Character set: 0-9a-zA-Z (62 characters)
 */

const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generate a unique ID based on timestamp and random number
 */
export function generateUniqueId(): bigint {
    const timestamp = BigInt(Date.now());
    const counter = BigInt(Math.floor(Math.random() * 10000));
    return (timestamp * 10000n) + counter;
}

/**
 * Encode a number to Base62 string
 */
export function base62Encode(num: bigint): string {
    if (num === 0n) return BASE62_CHARS[0];

    let result = '';
    let n = num;

    while (n > 0n) {
        result = BASE62_CHARS[Number(n % 62n)] + result;
        n = n / 62n;
    }

    // Ensure 6-8 characters (assignment requirement)
    return result.padStart(6, '0').slice(0, 8);
}

/**
 * Decode a Base62 string to number
 */
export function base62Decode(str: string): bigint {
    let result = 0n;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const value = BASE62_CHARS.indexOf(char);
        if (value === -1) {
            throw new Error(`Invalid character in Base62 string: ${char}`);
        }
        result = result * 62n + BigInt(value);
    }

    return result;
}

/**
 * Generate a short code using Base62 encoding
 */
export function generateShortCode(): string {
    const id = generateUniqueId();
    return base62Encode(id);
}

/**
 * Validate custom short code
 * Must be 6-8 alphanumeric characters
 */
export function validateCustomCode(code: string): boolean {
    const regex = /^[A-Za-z0-9]{6,8}$/;
    return regex.test(code);
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}
