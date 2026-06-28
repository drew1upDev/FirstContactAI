import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

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
