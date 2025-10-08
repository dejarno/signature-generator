/**
 * How to run (Web Server)
 *
 * Option A: ts-node (no build step)
 *   1) Ensure ts-node is installed:  npm i -g ts-node typescript  (or use npx)
 *   2) Run: ts-node index.ts
 *   3) Open: http://localhost:3000
 *
 * Option B: tsc + node
 *   1) Ensure TypeScript is installed: npm i -g typescript
 *   2) Compile: tsc index.ts --target ES2019 --module commonjs
 *   3) Run: node index.js
 *   4) Open: http://localhost:3000
 */

// Using CommonJS-style requires with loose typing to avoid needing @types/node
declare var require: any;
declare var module: any;
const http: any = require('http');
const url: any = require('url');
const querystring: any = require('querystring');

export interface SignatureData {
  name: string;
  title: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  logoUrl: string;
  linkedinUrl?: string | null;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateSignatureHtml(data: SignatureData): string {
  const name = escapeHtml(data.name);
  const title = escapeHtml(data.title);
  const email = escapeHtml(data.email);
  const phone = data.phone ? escapeHtml(data.phone) : '';
  const website = data.website ? escapeHtml(data.website) : '';
  const logoUrl = escapeHtml(data.logoUrl);
  const linkedinUrl = data.linkedinUrl ? escapeHtml(data.linkedinUrl) : '';

  const hasPhone = Boolean(data.phone);
  const hasWebsite = Boolean(data.website);
  const hasLinkedIn = Boolean(data.linkedinUrl);

  const mailtoHref = `mailto:${email}`;
  const phoneHref = hasPhone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';
  const websiteHref = hasWebsite
    ? (website.startsWith('http://') || website.startsWith('https://') ? website : `https://${website}`)
    : '';

  // Use table-based layout with inline CSS for maximum email client compatibility
  // Avoid <style> blocks and rely on basic, widely-supported CSS properties
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta http="x-ua-compatible" content="ie=edge" />
    <meta http="viewport" content="width=device-width, initial-scale=1" />
    <meta http="charset" content="utf-8" />
    <title>Email Signature</title>
  </head>
  <body style="margin:0; padding:0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif;">
      <tr>
        <td>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif;">
            <tr>
              <!-- Logo Column -->
              <td valign="middle" style="padding:0 12px 0 0;">
                <img src="${logoUrl}" alt="Company Logo" width="96" height="96" style="display:block; width:96px; height:96px; border:0; outline:none; text-decoration:none;" />
              </td>

              <!-- Separator Column -->
              <td style="width:1px; background-color:#e0e0e0; line-height:1px; font-size:1px;">&nbsp;</td>

              <!-- Text Column -->
              <td valign="top" style="padding:0 0 0 12px; font-family:Arial, sans-serif;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif;">
                  <tr>
                    <td style="font-family:Arial, sans-serif; color:#111111; font-size:16px; line-height:20px; font-weight:bold;">
                      ${name}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family:Arial, sans-serif; color:#555555; font-size:12px; line-height:16px; padding-top:2px;">
                      ${title}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:8px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif;">
                        <!-- Email -->
                        <tr>
                          <td style="font-family:Arial, sans-serif; color:#333333; font-size:12px; line-height:16px; padding:2px 0;">
                            <span style="color:#888888;">Email:</span>
                            <a href="${mailtoHref}" style="color:#1155cc; text-decoration:none;">${email}</a>
                          </td>
                        </tr>
                        <!-- Phone (optional) -->
                        ${hasPhone ? `<tr>
                          <td style="font-family:Arial, sans-serif; color:#333333; font-size:12px; line-height:16px; padding:2px 0;">
                            <span style="color:#888888;">Phone:</span>
                            <a href="${phoneHref}" style="color:#1155cc; text-decoration:none;">${phone}</a>
                          </td>
                        </tr>` : ''}
                        <!-- Website (optional) -->
                        ${hasWebsite ? `<tr>
                          <td style="font-family:Arial, sans-serif; color:#333333; font-size:12px; line-height:16px; padding:2px 0;">
                            <span style="color:#888888;">Web:</span>
                            <a href="${websiteHref}" style="color:#1155cc; text-decoration:none;">${website}</a>
                          </td>
                        </tr>` : ''}
                      </table>
                    </td>
                  </tr>
                  <!-- Social (optional) -->
                  ${hasLinkedIn ? `<tr>
                    <td style="padding-top:8px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:Arial, sans-serif;">
                        <tr>
                          <td style="font-family:Arial, sans-serif; color:#333333; font-size:12px; line-height:16px;">
                            <span style="color:#888888;">Connect:</span>
                            <a href="${linkedinUrl}" style="color:#1155cc; text-decoration:none;">LinkedIn</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  return html;
}

function renderFormPage(): string {
  // Minimal inline-styled page with a form posting to /generate
  return `<!DOCTYPE html>
<html>
  <head>
    <meta http="x-ua-compatible" content="ie=edge" />
    <meta http="viewport" content="width=device-width, initial-scale=1" />
    <meta http="charset" content="utf-8" />
    <title>Signature Generator</title>
  </head>
  <body style="margin:20px; font-family:Arial, sans-serif; color:#222;">
    <h1 style="font-size:18px; margin:0 0 12px 0;">Generate Email Signature</h1>
    <form method="POST" action="/generate" style="max-width:520px;">
      <div style="margin-bottom:8px;">
        <label for="name" style="display:block; font-size:12px; color:#555;">Name*</label>
        <input id="name" name="name" type="text" value="Alex Johnson" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="title" style="display:block; font-size:12px; color:#555;">Title*</label>
        <input id="title" name="title" type="text" value="Senior Product Manager" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="email" style="display:block; font-size:12px; color:#555;">Email*</label>
        <input id="email" name="email" type="email" value="alex.johnson@example.com" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="phone" style="display:block; font-size:12px; color:#555;">Phone</label>
        <input id="phone" name="phone" type="text" value="+1 (555) 123-4567" style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="website" style="display:block; font-size:12px; color:#555;">Website</label>
        <input id="website" name="website" type="text" value="example.com" style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="logoUrl" style="display:block; font-size:12px; color:#555;">Logo URL*</label>
        <input id="logoUrl" name="logoUrl" type="text" value="https://via.placeholder.com/96x96.png?text=Logo" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:16px;">
        <label for="linkedinUrl" style="display:block; font-size:12px; color:#555;">LinkedIn URL</label>
        <input id="linkedinUrl" name="linkedinUrl" type="text" value="https://www.linkedin.com/in/example" style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div>
        <button type="submit" style="background:#1155cc; color:#fff; border:0; padding:10px 14px; font-size:14px; cursor:pointer;">Generate signature.html</button>
      </div>
    </form>
    <p style="margin-top:16px; font-size:12px; color:#666;">Submitting will download a file named <strong>signature.html</strong>.</p>
  </body>
</html>`;
}

function parseBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    try { if (typeof req.setEncoding === 'function') req.setEncoding('utf8'); } catch (_) {}
    req.on('data', (chunk: any) => { body += String(chunk); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function startServer(port = 3000): void {
  const server = http.createServer(async (req: any, res: any) => {
    const parsed = url.parse(req.url || '', true);
    const method = (req.method || 'GET').toUpperCase();
    const pathname = parsed.pathname || '/';
    // eslint-disable-next-line no-console
    console.log(`[request] ${method} ${pathname}`);

    // Basic favicon ignore
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
        const data: SignatureData = {
          name: String(form.name || ''),
          title: String(form.title || ''),
          email: String(form.email || ''),
          phone: form.phone ? String(form.phone) : null,
          website: form.website ? String(form.website) : null,
          logoUrl: String(form.logoUrl || ''),
          linkedinUrl: form.linkedinUrl ? String(form.linkedinUrl) : null,
        };

        // Basic validation for required fields
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

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found');
  });

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer(3000);
}


