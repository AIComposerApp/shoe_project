import { Resend } from 'resend';

let resendClient: Resend | null = null;

export function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('WARNING: RESEND_API_KEY environment variable is not defined. Email sending will be bypassed.');
      return null;
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

interface OrderItem {
  id?: string;
  name?: string;
  price?: number;
  size?: string;
  color?: string;
  quantity?: number;
}

interface OrderDetails {
  email: string;
  amountNaira: number;
  amountUsd: number;
  reference: string;
  items: OrderItem[];
}

export async function sendOrderConfirmationEmail(order: OrderDetails) {
  const resend = getResendClient();
  if (!resend) return;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const itemRowsHtml = order.items && order.items.length > 0 
    ? order.items.map(item => `
        <tr style="border-bottom: 1px solid #eaeaea;">
          <td style="padding: 12px 0; font-family: sans-serif; font-size: 14px; text-transform: uppercase; font-weight: bold; color: #111111;">
            ${item.name || 'Men\'s Dasher NZ'} <br/>
            <span style="font-size: 11px; font-weight: normal; color: #666666; text-transform: none;">
              Size: ${item.size || '9'} | Color: ${item.color || 'Seagrass'}
            </span>
          </td>
          <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 14px; color: #1a1a1a;">
            $${item.price || '140'}
          </td>
        </tr>
      `).join('')
    : `
        <tr style="border-bottom: 1px solid #eaeaea;">
          <td style="padding: 12px 0; font-family: sans-serif; font-size: 14px; text-transform: uppercase; font-weight: bold; color: #111111;">
            Premium Athletic Shoes
          </td>
          <td style="padding: 12px 0; text-align: right; font-family: monospace; font-size: 14px; color: #1a1a1a;">
            $${order.amountUsd}
          </td>
        </tr>
      `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf9f6; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f6; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e8e6df; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              
              <!-- Brand Banner Header -->
              <tr>
                <td style="background-color: #1a1a1a; padding: 30px 40px; text-align: center;">
                  <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 0.1em; text-transform: uppercase;">
                    SHOE STORE
                  </h1>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <p style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 12px; font-weight: bold; color: #888888; text-transform: uppercase; letter-spacing: 0.15em;">
                    Thank you for your purchase
                  </p>
                  <h2 style="margin: 0 0 20px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: bold; color: #111111; tracking-tight: -0.02em;">
                    Your Order is Confirmed
                  </h2>
                  <p style="margin: 0 0 30px 0; font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #444444;">
                    We are getting your items ready for dispatch. A shipment confirmation email containing delivery tracking codes will be sent as soon as the carrier registers your package.
                  </p>

                  <div style="border-top: 2px solid #1a1a1a; padding-top: 15px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-family: sans-serif; font-size: 12px; font-weight: bold; color: #111111; text-transform: uppercase; letter-spacing: 0.1em;">
                      Order Summary
                    </h3>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${itemRowsHtml}
                    </table>
                  </div>

                  <!-- Price Breakdown -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 14px; color: #666666;">Original USD value</td>
                      <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 14px; color: #666666;">$${order.amountUsd.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 14px; color: #666666;">Local Currency Paid</td>
                      <td style="padding: 6px 0; text-align: right; font-family: monospace; font-size: 14px; font-weight: bold; color: #111111;">₦${order.amountNaira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0 6px 0; font-family: sans-serif; font-size: 14px; font-weight: bold; color: #111111; border-top: 1px solid #eaeaea;">Reference</td>
                      <td style="padding: 12px 0 6px 0; text-align: right; font-family: monospace; font-size: 12px; color: #444444; border-top: 1px solid #eaeaea;">${order.reference}</td>
                    </tr>
                  </table>
                  
                </td>
              </tr>

              <!-- Footer with customer service -->
              <tr>
                <td style="background-color: #fcfbfa; border-top: 1px solid #eaeaea; padding: 30px 40px; text-align: center;">
                  <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #888888; line-height: 1.5;">
                    If you have any questions, simply reply to this email or click to connect on our direct WhatsApp support channel.<br />
                    Shoe Store Ltd, Lagos, Nigeria.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: order.email,
      subject: `👟 Order Confirmation - SHOE STORE [Ref: ${order.reference.slice(0, 8)}]`,
      html: htmlContent,
    });
    console.log(`Receipt confirmation email successfully transmitted to ${order.email}`);
  } catch (err) {
    console.error('Error dispatching receipt confirmation email via Resend:', err);
  }
}

export async function sendAdminNotificationEmail(order: OrderDetails) {
  const resend = getResendClient();
  if (!resend) return;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL || 'mathewudochukwu656@gmail.com';

  const itemsListHtml = order.items && order.items.length > 0
    ? order.items.map(item => `
        <li style="margin-bottom: 8px; font-family: sans-serif; font-size: 14px; color: #111111;">
          <strong>[Qty ${item.quantity || 1}]</strong> ${item.name || 'Men\'s Dasher NZ'} - Size ${item.size || '9'} (Price: $${item.price || 140})
        </li>
      `).join('')
    : `<li style="font-family: sans-serif; font-size: 14px; color: #111111;">Athletic Shoes Order - $${order.amountUsd}</li>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Sale Notification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf9f6;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #1a1a1a; border-radius: 8px; overflow: hidden;">
              
              <tr>
                <td style="background-color: #25D366; padding: 25px 40px; text-align: left;">
                  <h1 style="margin: 0; font-family: sans-serif; font-size: 20px; font-weight: bold; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
                    🎉 NEW INCOMING SALE
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px 40px;">
                  <h2 style="margin: 0 0 15px 0; font-family: sans-serif; font-size: 16px; color: #111111; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                    TRANSACTION INSIGHTS
                  </h2>
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 14px; color: #555555; width: 140px;"><strong>Buyer:</strong></td>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 14px; color: #111111;">${order.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 14px; color: #555555;"><strong>Naira Paid:</strong></td>
                      <td style="padding: 6px 0; font-family: monospace; font-size: 14px; font-weight: bold; color: #25D366;">₦${order.amountNaira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 14px; color: #555555;"><strong>USD Value:</strong></td>
                      <td style="padding: 6px 0; font-family: monospace; font-size: 14px; color: #111111;">$${order.amountUsd.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 14px; color: #555555;"><strong>Reference:</strong></td>
                      <td style="padding: 6px 0; font-family: monospace; font-size: 13px; color: #444444;">${order.reference}</td>
                    </tr>
                  </table>

                  <h2 style="margin: 0 0 15px 0; font-family: sans-serif; font-size: 16px; color: #111111; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
                    ITEM SHIPPMENT LOGS
                  </h2>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${itemsListHtml}
                  </ul>
                  
                </td>
              </tr>

              <tr>
                <td style="background-color: #faf9f6; padding: 20px 40px; text-align: center; border-top: 1px solid #eaeaea;">
                  <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #888888;">
                    This is an automated alert sent directly from your Next.js application cloud runtime.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🚨 Resend Sale Alert: NGN ${order.amountNaira.toLocaleString()} received!`,
      html: htmlContent,
    });
    console.log(`Admin alert notification email successfully transmitted to ${adminEmail}`);
  } catch (err) {
    console.error('Error dispatching admin alert email via Resend:', err);
  }
}
