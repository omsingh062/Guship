import resend from 'resend';
import dotenv, { config } from dotenv.config();

export const resendClient = new resend.Resend(process.env.RESEND_API_KEY);

export const sender = {
  email: process.env.EMAIL_FROM,
  name: process.env.EMAIL_FROM_NAME,
};