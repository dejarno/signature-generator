// local require to avoid needing TS path/type resolution

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateSignatureHtml(data: any): string {
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
              <td style="width:1px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); line-height:1px; font-size:1px;">&nbsp;</td>
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
                            <a href="${mailtoHref}" style="color:#667eea; text-decoration:none; font-weight:500; margin-left:6px;">${email}</a>
                          </td>
                        </tr>
                        ${hasPhone ? `<tr>
                          <td style=\"font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#374151; font-size:13px; line-height:18px; padding:3px 0;\">
                            <span style=\"color:#9ca3af; font-weight:500;\">📞</span>
                            <a href=\"${phoneHref}\" style=\"color:#667eea; text-decoration:none; font-weight:500; margin-left:6px;\">${phone}</a>
                          </td>
                        </tr>` : ''}
                        ${hasWebsite ? `<tr>
                          <td style=\"font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color:#374151; font-size:13px; line-height:18px; padding:3px 0;\">
                            <span style=\"color:#9ca3af; font-weight:500;\">🌐</span>
                            <a href=\"${websiteHref}\" style=\"color:#667eea; text-decoration:none; font-weight:500; margin-left:6px;\">${website}</a>
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
                            <a href="${linkedinUrl}" style="color:#667eea; text-decoration:none; font-weight:500; margin-left:6px;">LinkedIn Profile</a>
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


