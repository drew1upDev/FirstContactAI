import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, body: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key missing. Skipping email send.');
    return { id: 'mock_id_' + Math.random().toString(36).substring(7) };
  }

  try {
    const data = await resend.emails.send({
      from: 'FirstContact AI <notifications@ctonew.app>',
      to: [to],
      subject,
      text: body,
    });
    return data;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
};
