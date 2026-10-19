<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventStaleHtmlResponses
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $contentType = $response->headers->get('Content-Type');

        if (! is_string($contentType) || ! str_starts_with($contentType, 'text/html')) {
            return $response;
        }

        if (! $response->headers->hasCacheControlDirective('no-store')) {
            $response->headers->set('Cache-Control', 'private, no-cache, must-revalidate');
        }

        $response->headers->set('CDN-Cache-Control', 'no-store');

        return $response;
    }
}
