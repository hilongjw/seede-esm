export async function GET(request) {
    const url = new URL(request.url);;
    const pathname = url.pathname;
    const searchParams = url.searchParams;

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

    return new Response(text, {
        headers: {
            'content-type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}