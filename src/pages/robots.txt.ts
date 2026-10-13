import type { APIRoute } from 'astro';

// robots.txt follows the same single switch as the robots meta (SEO-10,
// CODE-15): until the go-live build sets PUBLIC_SITE_INDEXABLE=true, nothing is
// crawled. In production, AI crawlers are named explicitly (SEO-09): the
// generic rule would admit them anyway, but the permission stays declared even
// if defaults change.
//
// The client manual's path must never appear here, not even in a comment of
// the output: robots.txt is public and would reveal it (SEO-11).
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
];

export const GET: APIRoute = ({ site }) => {
  const indexable = import.meta.env.PUBLIC_SITE_INDEXABLE === 'true';
  const body = indexable
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
        `Sitemap: ${new URL('/sitemap-index.xml', site)}`,
        '',
      ].join('\n')
    : ['# Not live yet: no indexing until go-live.', 'User-agent: *', 'Disallow: /', ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
