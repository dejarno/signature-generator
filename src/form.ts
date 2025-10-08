const { DEFAULTS }: any = require('./config');

export function renderFormPage(): string {
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
    <div style="display:flex; gap:16px; align-items:flex-start;">
    <form id="sig-form" method="POST" action="/generate" style="max-width:520px; flex:1;">
      <div style="margin-bottom:8px;">
        <label for="name" style="display:block; font-size:12px; color:#555;">Name*</label>
        <input id="name" name="name" type="text" value="${DEFAULTS.name}" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="title" style="display:block; font-size:12px; color:#555;">Title*</label>
        <input id="title" name="title" type="text" value="${DEFAULTS.title}" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="email" style="display:block; font-size:12px; color:#555;">Email*</label>
        <input id="email" name="email" type="email" value="${DEFAULTS.email}" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="phone" style="display:block; font-size:12px; color:#555;">Phone</label>
        <input id="phone" name="phone" type="text" value="${DEFAULTS.phone}" style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="website" style="display:block; font-size:12px; color:#555;">Website</label>
        <input id="website" name="website" type="text" value="${DEFAULTS.website}" style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:8px;">
        <label for="logoUrl" style="display:block; font-size:12px; color:#555;">Logo URL*</label>
        <input id="logoUrl" name="logoUrl" type="text" value="${DEFAULTS.logoUrl}" required style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div style="margin-bottom:16px;">
        <label for="linkedinUrl" style="display:block; font-size:12px; color:#555;">LinkedIn URL</label>
        <input id="linkedinUrl" name="linkedinUrl" type="text" value="${DEFAULTS.linkedinUrl}" style="width:100%; padding:8px; font-size:14px;" />
      </div>
      <div>
        <button type="submit" style="background:#1155cc; color:#fff; border:0; padding:10px 14px; font-size:14px; cursor:pointer;">Generate signature.html</button>
      </div>
    </form>
    <div style="flex:1; min-width:320px;">
      <div style="font-size:12px; color:#555; margin-bottom:6px;">Live Preview</div>
      <iframe id="preview" title="Signature Preview" style="width:100%; height:360px; border:1px solid #ddd;"></iframe>
    </div>
    </div>
    <p style="margin-top:16px; font-size:12px; color:#666;">Submitting will download a file named <strong>signature.html</strong>.</p>
    <script>
      const form = document.getElementById('sig-form');
      const iframe = document.getElementById('preview');
      function updatePreview() {
        try { console.log('[preview] update triggered'); } catch (e) {}
        const formData = new FormData(form);
        const params = new URLSearchParams();
        for (const [k, v] of formData.entries()) {
          params.append(k, v);
        }
        const bodyStr = params.toString();
        try { console.log('[preview] request bytes=', bodyStr.length); } catch (e) {}
        fetch('/preview', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: bodyStr })
          .then(r => r.text())
          .then(html => {
            try { console.log('[preview] response bytes=', html.length); } catch (e) {}
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(html);
            doc.close();
          })
          .catch(err => { try { console.error('[preview] error', err); } catch (e) {} });
      }
      form.addEventListener('input', e => { try { console.log('[preview] input event', e.target && e.target.name); } catch (e2) {} ; updatePreview(); });
      window.addEventListener('DOMContentLoaded', () => { try { console.log('[preview] DOMContentLoaded'); } catch (e) {} ; updatePreview(); });
    </script>
  </body>
</html>`;
}


