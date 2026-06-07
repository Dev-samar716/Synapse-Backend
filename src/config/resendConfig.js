import { Resend } from 'resend';

let resend = new Resend(process.env.RESEND_API_KEY);

export default resend;