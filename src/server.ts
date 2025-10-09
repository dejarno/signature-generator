import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import { generateSignatureHtml } from './signature';
import { renderFormPage } from './form';
import { SignatureData } from './types';

function parseBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    try { if (typeof req.setEncoding === 'function') req.setEncoding('utf8'); } catch (_) {}
    req.on('data', (chunk: any) => { body += String(chunk); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function toSignatureData(form: Record<string, unknown>): SignatureData {
  return {
    name: String(form.name || ''),
    title: String(form.title || ''),
    email: String(form.email || ''),
    phone: form.phone ? String(form.phone) : null,
    website: form.website ? String(form.website) : null,
    logoUrl: String(form.logoUrl || ''),
    linkedinUrl: form.linkedinUrl ? String(form.linkedinUrl) : null,
  };
}

export function startServer(port = 3000): void {
  const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
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

        const data = toSignatureData(form);

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
        const data = toSignatureData(form);
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


