import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string) => {
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials missing. Skipping SMS send.');
    return { sid: 'mock_sid_' + Math.random().toString(36).substring(7) };
  }

  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    return message;
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    throw error;
  }
};

export const makeCall = async (to: string, leadId: string) => {
  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials missing. Skipping call.');
    return { sid: 'mock_call_sid_' + Math.random().toString(36).substring(7) };
  }

  try {
    const call = await client.calls.create({
      url: `${appBaseUrl}/api/webhooks/voice?leadId=${leadId}`,
      to,
      from: fromNumber,
    });
    return call;
  } catch (error) {
    console.error('Error making call via Twilio:', error);
    throw error;
  }
};
