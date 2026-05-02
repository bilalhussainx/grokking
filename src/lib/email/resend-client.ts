import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "Coach Kairos <coach@kairoslearn.com>";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ id: string } | { skipped: true }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", input.to);
    return { skipped: true };
  }
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo,
  });
  if (error) throw new Error(error.message ?? "resend send failed");
  if (!data?.id) throw new Error("resend returned no id");
  return { id: data.id };
}
