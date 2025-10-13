// CommonJS-style requires to avoid ESM config
declare var require: any;
const http: any = require('http');
const url: any = require('url');
const querystring: any = require('querystring');
const { generateSignatureHtml }: any = require('./signature');
const { renderFormPage }: any = require('./form');

/**
 * Reads the entire request body as a UTF-8 string.
 * Useful for parsing small form submissions sent as application/x-www-form-urlencoded.
 */
function parseBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    try { if (typeof req.setEncoding === 'function') req.setEncoding('utf8'); } catch (_) {}
    req.on('data', (chunk: any) => { body += String(chunk); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

/**
 * Starts a minimal HTTP server that serves the signature form, generates
 * downloadable HTML signatures, and provides a live preview endpoint.
 * 
 * TODO
 *
 * Routes:
 * - GET /          → Renders the form page
 * - POST /generate → Returns a signature.html file for download
 * - POST /preview  → Returns signature HTML for inline preview
 */
export function startServer(port = 3000): void {
  console.log(`[startServer] port=${port}`);
  const server = http.createServer(async (req: any, res: any) => {
    const parsed = url.parse(req.url || '', true);
    const method = (req.method || 'GET').toUpperCase();
    const pathname = parsed.pathname || '/';

    console.log(`[request] ${method} ${pathname}`);

    if (pathname === '/favicon.ico') {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (method === 'GET' && pathname === '/') {
      const page = renderFormPage();
      console.log('[serve] form page');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(page);
      return;
    }

    if (method === 'POST' && pathname === '/generate') {
      try {
        const raw = await parseBody(req);
        console.log(`[body] length=${raw.length}`);
        const form = querystring.parse(raw);
        console.log('[form]', form);

        const data = {
          name: String(form.name || ''),
          title: String(form.title || ''),
          email: String(form.email || ''),
          phone: form.phone ? String(form.phone) : null,
          website: form.website ? String(form.website) : null,
          logoUrl: String(form.logoUrl || ''),
          linkedinUrl: form.linkedinUrl ? String(form.linkedinUrl) : null,
        };

        if (!data.name || !data.title || !data.email || !data.logoUrl) {
          console.warn('[validation] missing required fields', { name: !!data.name, title: !!data.title, email: !!data.email, logoUrl: !!data.logoUrl });
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end('Missing required fields: name, title, email, logoUrl');
          return;
        }

        const html = generateSignatureHtml(data);
        console.log('[generate] signature html size=', html.length);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="signature.html"');
        res.end(html);
        return;
      } catch (err) {
        console.error('[error]', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Internal Server Error');
        return;
      }
    }

    if (method === 'POST' && pathname === '/preview') {
      try {
        const raw = await parseBody(req);
        console.log(`[preview] body length=${raw.length}`);
        const form = querystring.parse(raw);
        console.log('[preview] form', form);
        const data = {
          name: String(form.name || ''),
          title: String(form.title || ''),
          email: String(form.email || ''),
          phone: form.phone ? String(form.phone) : null,
          website: form.website ? String(form.website) : null,
          logoUrl: String(form.logoUrl || ''),
          linkedinUrl: form.linkedinUrl ? String(form.linkedinUrl) : null,
        };
        const html = generateSignatureHtml(data);
        console.log('[preview] html size=', html.length);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
        return;
      } catch (err) {
        console.error('[error][preview]', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Internal Server Error');
        return;
      }
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found');
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}


