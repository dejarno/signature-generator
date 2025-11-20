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
      
      :root {
        --accent-color: ${DEFAULTS.accentColor};
        --accent-gradient-from: ${DEFAULTS.accentColor};
        --accent-gradient-to: ${DEFAULTS.accentColor};
        --accent-shadow-color: rgba(102, 126, 234, 0.18);
        --accent-slider-gradient: linear-gradient(90deg, ${DEFAULTS.accentColor} 0%, ${DEFAULTS.accentColor} 100%);
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: linear-gradient(135deg, var(--accent-gradient-from) 0%, var(--accent-gradient-to) 100%);
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

      .color-slider {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .color-slider input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 12px;
        border-radius: 999px;
        background: var(--accent-slider-gradient);
        outline: none;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .color-slider input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--accent-color);
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .color-slider input[type="range"]::-webkit-slider-thumb:active {
        transform: scale(1.1);
        box-shadow: 0 6px 14px rgba(0,0,0,0.25);
      }

      .color-slider input[type="range"]::-moz-range-track {
        height: 12px;
        border-radius: 999px;
        background: var(--accent-slider-gradient);
      }

      .color-slider input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--accent-color);
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .color-slider input[type="range"]:active::-moz-range-thumb {
        transform: scale(1.1);
        box-shadow: 0 6px 14px rgba(0,0,0,0.25);
      }

      .color-slider__meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        font-family: inherit;
      }

      .color-slider__swatch {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        border: 2px solid rgba(255,255,255,0.6);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        background: var(--accent-color);
      }

      .color-slider__value {
        font-size: 0.85rem;
        font-weight: 600;
        color: #374151;
        letter-spacing: 0.5px;
      }
      
      .form-group input:focus {
        outline: none;
        border-color: var(--accent-color);
        background: white;
        box-shadow: 0 0 0 3px var(--accent-shadow-color);
      }
      
      .form-group input:required {
        border-left: 4px solid var(--accent-color);
      }
      
      .submit-btn {
        background: linear-gradient(135deg, var(--accent-gradient-from) 0%, var(--accent-gradient-to) 100%);
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
        box-shadow: 0 4px 15px var(--accent-shadow-color);
      }
      
      .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px var(--accent-shadow-color);
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
        background: linear-gradient(135deg, var(--accent-gradient-from) 0%, var(--accent-gradient-to) 100%);
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

            <div class="form-group">
              <label for="accentHue">Accent Color</label>
              <div class="color-slider">
                <input id="accentHue" name="accentHue" type="range" min="0" max="360" value="${DEFAULTS.accentHue}" aria-label="Select accent color hue" />
                <div class="color-slider__meta">
                  <div class="color-slider__swatch" id="accentColorSwatch" aria-hidden="true"></div>
                  <span class="color-slider__value" id="accentColorValue">${DEFAULTS.accentColor.toUpperCase()}</span>
                </div>
                <input id="accentColor" name="accentColor" type="hidden" value="${DEFAULTS.accentColor}" />
              </div>
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
        const accentHueInput = document.getElementById('accentHue');
        const accentColorInput = document.getElementById('accentColor');
        const accentSwatch = document.getElementById('accentColorSwatch');
        const accentValue = document.getElementById('accentColorValue');
        const rootStyle = document.documentElement ? document.documentElement.style : null;
        const FALLBACK_ACCENT = '${DEFAULTS.accentColor.toLowerCase()}';

        function normalizeHex(hex) {
          if (typeof hex !== 'string') {
            return FALLBACK_ACCENT;
          }

          let value = hex.trim().replace(/^#/, '');

          if (value.length === 3) {
            value = value
              .split('')
              .map(char => \`\${char}\${char}\`) // Escaped inner template literal
              .join('');
          }

          if (value.length !== 6) {
            return FALLBACK_ACCENT;
          }

          return \`#\${value.toLowerCase()}\`; // Escaped inner template literal
        }

        function hslToHex(h, s, l) {
          const saturation = Math.max(0, Math.min(100, s)) / 100;
          const lightness = Math.max(0, Math.min(100, l)) / 100;
          const k = n => (n + h / 30) % 12;
          const a = saturation * Math.min(lightness, 1 - lightness);
          const f = n => lightness - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
          const toHex = x => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, '0');
          return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`.toLowerCase(); // Escaped inner template literal
        }

        function hexToRgb(hex) {
          const value = normalizeHex(hex).replace('#', '');
          return {
            r: parseInt(value.substring(0, 2), 16),
            g: parseInt(value.substring(2, 4), 16),
            b: parseInt(value.substring(4, 6), 16),
          };
        }

        function rgbToHex(r, g, b) {
          const clamp = n => Math.max(0, Math.min(255, Math.round(n)));
          const toHex = n => clamp(n).toString(16).padStart(2, '0');
          return \`#\${toHex(r)}\${toHex(g)}\${toHex(b)}\`; // Escaped inner template literal
        }

        function mixHex(base, mix, weight) {
          const w = Math.max(0, Math.min(1, weight));
          const baseRgb = hexToRgb(base);
          const mixRgb = hexToRgb(mix);

          return rgbToHex(
            baseRgb.r * (1 - w) + mixRgb.r * w,
            baseRgb.g * (1 - w) + mixRgb.g * w,
            baseRgb.b * (1 - w) + mixRgb.b * w,
          );
        }

        function shadeHex(hex, amount) {
          if (amount === 0) {
            return normalizeHex(hex);
          }

          if (amount > 0) {
            return mixHex(hex, '#ffffff', Math.min(1, amount));
          }

          return mixHex(hex, '#000000', Math.min(1, Math.abs(amount)));
        }

        function hexToRgba(hex, alpha) {
          const { r, g, b } = hexToRgb(hex);
          const clampedAlpha = Math.max(0, Math.min(1, alpha));
          return \`rgba(\${r}, \${g}, \${b}, \${clampedAlpha})\`; // Escaped inner template literal
        }

        function syncAccentColor() {
          if (!accentHueInput || !accentColorInput || !rootStyle) {
            return;
          }

          const hue = Number(accentHueInput.value || 0);
          const baseHex = hslToHex(hue, 72, 58);
          const gradientFrom = shadeHex(baseHex, -0.18);
          const gradientTo = shadeHex(baseHex, 0.18);
          const sliderGradient = \`linear-gradient(90deg, hsl(\${hue}, 80%, 45%) 0%, hsl(\${hue}, 80%, 60%) 50%, hsl(\${hue}, 80%, 75%) 100%)\`; // Escaped inner template literal

          accentColorInput.value = baseHex;

          if (accentSwatch) {
            accentSwatch.style.background = baseHex;
          }

          if (accentValue) {
            accentValue.textContent = baseHex.toUpperCase();
          }

          rootStyle.setProperty('--accent-color', baseHex);
          rootStyle.setProperty('--accent-gradient-from', gradientFrom);
          rootStyle.setProperty('--accent-gradient-to', gradientTo);
          rootStyle.setProperty('--accent-shadow-color', hexToRgba(baseHex, 0.25));
          rootStyle.setProperty('--accent-slider-gradient', sliderGradient);
        }

        function updatePreview() {
          if (!form || !iframe) {
            return;
          }

          syncAccentColor();

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
            console.log(\`[preview] request bytes=\${bodyStr.length}\`); // Escaped inner template literal
          } catch (e) {}
          
          fetch('/preview', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
            body: bodyStr 
          })
            .then(r => r.text())
            .then(html => {
              try { 
                console.log(\`[preview] response bytes=\${html.length}\`); // Escaped inner template literal
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

        if (form) {
          form.addEventListener('input', e => { 
            try { 
              console.log(\`[preview] input event \${e.target && e.target.name}\`); // Escaped inner template literal
            } catch (e2) {} 
            updatePreview(); 
          });
        }
        
        window.addEventListener('DOMContentLoaded', () => { 
          try { 
            console.log('[preview] DOMContentLoaded'); 
          } catch (e) {}

          syncAccentColor();
          updatePreview(); 
        });
      </script>
    </div>
  </body>
</html>`;
}