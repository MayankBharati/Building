import { google } from 'googleapis';
import dotenv from "dotenv";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];

export { oauth2Client, scopes };