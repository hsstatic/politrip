type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!apiKey || !from) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  return res.ok;
}

export function passwordResetEmail(args: { firstName: string; resetUrl: string }) {
  const name = args.firstName.trim() || "there";
  const subject = "Reset your PoliTrip password";
  const text = `Hello ${name},\n\nWe received a request to reset your PoliTrip password.\n\nOpen this link within 1 hour:\n${args.resetUrl}\n\nIf you did not request this, you can ignore this email.\n\n— PoliTrip`;
  const html = `
    <div style="font-family:Georgia,serif;background:#faf8f4;padding:32px;color:#1c1917">
      <p style="letter-spacing:0.22em;text-transform:uppercase;font-size:11px;color:#b45309;font-weight:700">PoliTrip</p>
      <h1 style="font-weight:400;font-size:28px;margin:12px 0 16px">Reset your password</h1>
      <p style="line-height:1.6;color:#6d5f43">Hello ${escapeHtml(name)}, we received a request to reset the password on your PoliTrip account.</p>
      <p style="margin:28px 0">
        <a href="${escapeHtml(args.resetUrl)}" style="display:inline-block;background:#b45309;color:#fff;text-decoration:none;padding:14px 22px;border-radius:12px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase">Set a new password</a>
      </p>
      <p style="font-size:13px;line-height:1.6;color:#7c7468">This link expires in 1 hour. If you did not request a reset, you can ignore this email.</p>
    </div>
  `;
  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
