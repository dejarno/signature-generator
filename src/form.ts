const { DEFAULTS }: any = require('./config');

export function renderFormPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>Email Signature Generator</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        color: #333;
        line-height: 1.6;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      
      .header {
        text-align: center;
        margin-bottom: 3rem;
        color: white;
      }
      
      .header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .header p {
        font-size: 1.1rem;
        opacity: 0.9;
        font-weight: 300;
      }
      
      .main-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
      }
      
      .form-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-group label {
        display: block;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .form-group input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.2s ease;
        background: #fafafa;
      }
      
      .form-group input:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
      
      .form-group input:required {
        border-left: 4px solid #667eea;
      }
      
      .submit-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      
      .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }
      
      .submit-btn:active {
        transform: translateY(0);
      }
      
      .preview-card {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
      }
      
      .preview-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
      }
      
      .preview-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #374151;
        margin-left: 0.5rem;
      }
      
      .preview-icon {
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.875rem;
        font-weight: bold;
      }
      
      .preview-frame {
        width: 100%;
        height: 400px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        background: #f9fafb;
        overflow: hidden;
      }
      
      .preview-frame iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: white;
      }
      
      .info-text {
        margin-top: 2rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: 8px;
        backdrop-filter: blur(10px);
      }
      
      .info-text strong {
        color: white;
        font-weight: 600;
      }
      
      @media (max-width: 768px) {
        .container {
          padding: 1rem;
        }
        
        .header h1 {
          font-size: 2rem;
        }
        
        .main-content {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        
        .form-card, .preview-card {
          padding: 1.5rem;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Email Signature Generator</h1>
        <p>Create professional email signatures in seconds</p>
      </div>
      
      <div class="main-content">
        <div class="form-card">
          <form id="sig-form" method="POST" action="/generate">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input id="name" name="name" type="text" value="${DEFAULTS.name}" required placeholder="Enter your full name" />
            </div>
            
            <div class="form-group">
              <label for="title">Job Title *</label>
              <input id="title" name="title" type="text" value="${DEFAULTS.title}" required placeholder="Enter your job title" />
            </div>
            
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input id="email" name="email" type="email" value="${DEFAULTS.email}" required placeholder="your.email@company.com" />
            </div>
            
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input id="phone" name="phone" type="text" value="${DEFAULTS.phone}" placeholder="+1 (555) 123-4567" />
            </div>
            
            <div class="form-group">
              <label for="website">Website</label>
              <input id="website" name="website" type="text" value="${DEFAULTS.website}" placeholder="www.yourcompany.com" />
            </div>
            
            <div class="form-group">
              <label for="logoUrl">Logo URL *</label>
              <input id="logoUrl" name="logoUrl" type="text" value="${DEFAULTS.logoUrl}" required placeholder="https://example.com/logo.png" />
            </div>
            
            <div class="form-group">
              <label for="linkedinUrl">LinkedIn Profile</label>
              <input id="linkedinUrl" name="linkedinUrl" type="text" value="${DEFAULTS.linkedinUrl}" placeholder="https://linkedin.com/in/yourprofile" />
            </div>
            
            <button type="submit" class="submit-btn">
              Generate Signature
            </button>
          </form>
        </div>
        
        <div class="preview-card">
          <div class="preview-header">
            <div class="preview-icon">👁</div>
            <h3>Live Preview</h3>
          </div>
          <div class="preview-frame">
            <iframe id="preview" title="Signature Preview"></iframe>
          </div>
        </div>
      </div>
      
      <div class="info-text">
        <p>Submitting will download a file named <strong>signature.html</strong> that you can use in your email client.</p>
      </div>
      <script>
        const form = document.getElementById('sig-form');
        const iframe = document.getElementById('preview');
        
        function updatePreview() {
          try { 
            console.log('[preview] update triggered'); 
          } catch (e) {}
          
          const formData = new FormData(form);
          const params = new URLSearchParams();
          for (const [k, v] of formData.entries()) {
            params.append(k, v);
          }
          const bodyStr = params.toString();
          
          try { 
            console.log('[preview] request bytes=', bodyStr.length); 
          } catch (e) {}
          
          fetch('/preview', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
            body: bodyStr 
          })
            .then(r => r.text())
            .then(html => {
              try { 
                console.log('[preview] response bytes=', html.length); 
              } catch (e) {}
              
              const doc = iframe.contentDocument || iframe.contentWindow.document;
              doc.open();
              doc.write(html);
              doc.close();
            })
            .catch(err => { 
              try { 
                console.error('[preview] error', err); 
              } catch (e) {} 
            });
        }
        
        form.addEventListener('input', e => { 
          try { 
            console.log('[preview] input event', e.target && e.target.name); 
          } catch (e2) {} 
          updatePreview(); 
        });
        
        window.addEventListener('DOMContentLoaded', () => { 
          try { 
            console.log('[preview] DOMContentLoaded'); 
          } catch (e) {} 
          updatePreview(); 
        });
      </script>
    </div>
  </body>
</html>`;
}


