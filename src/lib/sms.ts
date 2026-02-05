
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client if creds exist
const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

export async function sendSMS(to: string, message: string) {
    // 1. Validate phone number (basic check)
    if (!to) {
        console.warn('⚠️ SMS Skipped: No phone number provided.');
        return false;
    }

    try {
        if (client && twilioNumber) {
            // 2. Real Send (if configured)
            await client.messages.create({
                body: message,
                from: twilioNumber,
                to: to
            });
            console.log(`✅ SMS Sent to ${to}: "${message}"`);
            return true;
        } else {
            // 3. Mock Send (Console Log) - For development/demo
            console.log(`
            📲 [MOCK SMS] 
            To: ${to}
            Message: "${message}"
            ---------------------------------------------------
            (To send real SMS, configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env)
            `);
            return true; // Pretend it worked
        }
    } catch (error) {
        console.error('❌ Failed to send SMS:', error);
        return false;
    }
}
