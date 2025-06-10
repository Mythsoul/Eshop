// Check if environment is production
export const isProduction = process.env.NODE_ENV === 'production';

// Middleware to block routes in production
export function blockInProduction(handler) {
  return async (req) => {
    if (isProduction) {
      return new Response(JSON.stringify({ error: 'Not available in production' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return handler(req);
  };
}
