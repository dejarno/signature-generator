// local require to avoid needing TS path/type resolution

const DEFAULT_ACCENT_COLOR = '#667eea';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

type Rgb = { r: number; g: number; b: number };

function normalizeHexColor(input: unknown): string {
  if (typeof input !== 'string') {
    return DEFAULT_ACCENT_COLOR;
  }

  const trimmed = input.trim();
  const match = trimmed.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (!match) {
    return DEFAULT_ACCENT_COLOR;
  }

  let hex = match[1];

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => `${char}${char}`)
      .join('');
  }

  return `#${hex.toLowerCase()}`;
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHexColor(hex).slice(1);
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (value: number) => clampChannel(value).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHexColors(base: string, mix: string, weight: number): string {
  const w = Math.max(0, Math.min(1, weight));
  const baseRgb = hexToRgb(base);
  const mixRgb = hexToRgb(mix);

  return rgbToHex({
    r: baseRgb.r * (1 - w) + mixRgb.r * w,
    g: baseRgb.g * (1 - w) + mixRgb.g * w,
    b: baseRgb.b * (1 - w) + mixRgb.b * w,
  });
}

function shadeHexColor(hex: string, amount: number): string {
  if (amount === 0) {
    return normalizeHexColor(hex);
  }

  if (amount > 0) {
    return mixHexColors(hex, '#ffffff', Math.min(1, amount));
  }

  return mixHexColors(hex, '#000000', Math.min(1, Math.abs(amount)));
}

export function generateSignatureHtml(data: any): string {
  const name = escapeHtml(data.name);
  const title = escapeHtml(data.title);
  const email = escapeHtml(data.email);
  const phone = data.phone ? escapeHtml(data.phone) : '';
  const website = data.website ? escapeHtml(data.website) : '';
  const logoUrl = escapeHtml(data.logoUrl);
  const linkedinUrl = data.linkedinUrl ? escapeHtml(data.linkedinUrl) : '';
  const accentColor = normalizeHexColor(data.accentColor);
  const accentGradientFrom = shadeHexColor(accentColor, -0.18);
  const accentGradientTo = shadeHexColor(accentColor, 0.18);

  const hasPhone = Boolean(data.phone);
  const hasWebsite = Boolean(data.website);
  const hasLinkedIn = Boolean(data.linkedinUrl);

  const mailtoHref = `mailto:${email}`;
  const phoneHref = hasPhone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';
  const websiteHref = hasWebsite
    ? (website.startsWith('http://') || website.startsWith('https://') ? website : `https://${website}`)
    : '';

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta http="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta charset="utf-8" />
    <title>Email Signature</title>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; width:100%;">
      <tr>
        <td style="padding:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; width:100%; max-width:600px;">
            <tr>
              <td valign="middle" style="padding:0 20px 0 0;">
                <img src="${logoUrl}" alt="Company Logo" width="80" height="80" style="display:block; width:80px; height:80px; border:0; outline:none; text-decoration:none; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);" />
              </td>
              <td style="width:1px; background:linear-gradient(135deg, ${accentGradientFrom} 0%, ${accentGradientTo} 100%); line-height:1px; font-size:1px;">&nbsp;</td>
              <td valign="top" style="padding:0 0 0 20px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
                  <tr>
                    <td style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#1f2937; font-size:18px; line-height:24px; font-weight:700; letter-spacing:-0.025em;">
                      ${name}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#6b7280; font-size:14px; line-height:20px; padding-top:4px; font-weight:500;">
                      ${title}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:12px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
                        <tr>
                          <td style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#374151; font-size:13px; line-height:18px; padding:3px 0;">
                            <span style="color:#9ca3af; font-weight:500;">📧</span>
                            <a href="${mailtoHref}" style="color:${accentColor}; text-decoration:none; font-weight:500; margin-left:6px;">${email}</a>
                          </td>
                        </tr>
                        ${hasPhone ? `<tr>
                          <td style=\"font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#374151; font-size:13px; line-height:18px; padding:3px 0;\">
                            <span style=\"color:#9ca3af; font-weight:500;\">📞</span>
                            <a href=\"${phoneHref}\" style=\"color:${accentColor}; text-decoration:none; font-weight:500; margin-left:6px;\">${phone}</a>
                          </td>
                        </tr>` : ''}
                        ${hasWebsite ? `<tr>
                          <td style=\"font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#374151; font-size:13px; line-height:18px; padding:3px 0;\">
                            <span style=\"color:#9ca3af; font-weight:500;\">🌐</span>
                            <a href=\"${websiteHref}\" style=\"color:${accentColor}; text-decoration:none; font-weight:500; margin-left:6px;\">${website}</a>
                          </td>
                        </tr>` : ''}
                      </table>
                    </td>
                  </tr>
                  ${hasLinkedIn ? `<tr>
                    <td style="padding-top:12px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
                        <tr>
                          <td style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#374151; font-size:13px; line-height:18px;">
                            <span style="color:#9ca3af; font-weight:500;">💼</span>
                            <a href="${linkedinUrl}" style="color:${accentColor}; text-decoration:none; font-weight:500; margin-left:6px;">LinkedIn Profile</a>
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


