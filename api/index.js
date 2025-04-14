export async function GET(request) {
    const url = new URL(request.url);;
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // Handle favicon.ico request with an empty response
    if (pathname === '/api/favicon.ico') {
        return new Response('', {
            status: 204, // No Content
            headers: {
                'Cache-Control': 'public, max-age=86400', // Cache for 1 day
            }
        });
    }

    // Remove /api prefix and keep query parameters
    const targetPath = pathname.replace(/^\/api/, '');

    // Construct target URL with query parameters
    const targetUrl = new URL(`https://esm.sh${targetPath}`);
    searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value);
    });

    // Forward the request with query parameters
    const response = await fetch(targetUrl.toString());
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    // Calculate cache duration based on content type
    let cacheDuration = 60 * 60 * 24; // Default: 1 day in seconds
    if (contentType && (
        contentType.includes('javascript') ||
        contentType.includes('application/json') ||
        contentType.includes('text/css')
    )) {
        cacheDuration = 60 * 60 * 24 * 7; // 7 days for static assets
    }

    return new Response(text, {
        headers: {
            'content-type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Cache-Control': `public, max-age=${cacheDuration}, s-maxage=${cacheDuration}, stale-while-revalidate=${cacheDuration * 2}`,
            'CDN-Cache-Control': `public, max-age=${cacheDuration}`,
            'Vercel-CDN-Cache-Control': `public, max-age=${cacheDuration}`,
            'Surrogate-Control': `public, max-age=${cacheDuration}`
        }
    });
}