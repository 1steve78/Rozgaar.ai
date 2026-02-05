import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: "Rozgaar <noreply@rozgaar.ai>",
    to: email,
    subject: "Welcome aboard 🚀",
    html: `<h1>Hello ${name}</h1><p>Your account is ready.</p>`
  });
}
