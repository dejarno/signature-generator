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
              <td valign="middle" style="padding:0 12px 0 0;">
                <img src="${logoUrl}" alt="Company Logo" width="96" height="96" style="display:block; width:96px; height:96px; border:0; outline:none; text-decoration:none;" />
              </td>
              <td style="width:1px; background-color:#e0e0e0; line-height:1px; font-size:1px;">&nbsp;</td>
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
                        <tr>
                          <td style="font-family:Arial, sans-serif; color:#333333; font-size:12px; line-height:16px; padding:2px 0;">
                            <span style="color:#888888;">Email:</span>
                            <a href="${mailtoHref}" style="color:#1155cc; text-decoration:none;">${email}</a>
                          </td>
                        </tr>
                        ${hasPhone ? `<tr>
                          <td style=\"font-family:Arial, sans-serif; color:#333333; font-size:12px; line-height:16px; padding:2px 0;\">
                            <span style=\"color:#888888;\">Phone:</span>
                            <a href=\"${phoneHref}\" style=\"color:#1155cc; text-decoration:none;\">${phone}</a>
                          </td>
                        </tr>` : ''}
                        ${hasWebsite ? `<tr>
                          <td style=\"font-family:Arial, sans-serif; color:#333333; font-size:12px; line-height:16px; padding:2px 0;\">
                            <span style=\"color:#888888;\">Web:</span>
                            <a href=\"${websiteHref}\" style=\"color:#1155cc; text-decoration:none;\">${website}</a>
                          </td>
                        </tr>` : ''}
                      </table>
                    </td>
                  </tr>
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


