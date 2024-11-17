import { handleGoogleAuth, handleGoogleCallback } from '../controllers/googleAuthController.js';
import axios from 'axios';

// Helper function to decode base64url
const decodeBase64url = (data) => {
  let padding = data.length % 4;
  if (padding) {
    data += '='.repeat(4 - padding);
  }
  return Buffer.from(data, 'base64').toString('utf-8');
};

// Function to fetch individual email details
const fetchEmailDetails = async (emailId, accessToken) => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 200) {
    const emailData = response.data;
    const payload = emailData.payload || {};
    const headers = payload.headers || [];
    const subject = headers.find(item => item.name === 'Subject')?.value || 'No Subject';
    const sender = headers.find(item => item.name === 'From')?.value || 'Unknown Sender';
    let body = 'No plain text content found.';
    const parts = payload.parts || [];

    for (const part of parts) {
      if (part.mimeType === 'text/plain') {
        body = decodeBase64url(part.body.data);
        break;
      }
    }

    return {
      id: emailId,
      subject: subject,
      sender: sender,
      body: body,
    };
  } else {
    return { error: `Error fetching email: ${response.status}` };
  }
};

// Google OAuth routes handler
async function googleAuthRoutes(fastify) {
  // Route for generating the Google auth URL
  fastify.get('/get-url', handleGoogleAuth);

  // Route for handling the Google OAuth callback
  fastify.get('/google-callback', handleGoogleCallback);

  // Route to handle success after Google OAuth
  fastify.get('/auth-success', async (request, reply) => {
    const { access_token, refresh_token } = request.query;

    if (!access_token || !refresh_token) {
      return reply.status(400).send({
        message: 'Tokens are missing in the URL',
        error: 'Bad Request',
        statusCode: 400
      });
    }

    // Redirect to the frontend with tokens in the URL
    return reply.redirect(`https://earthwormai.netlify.app/emails?access_token=${access_token}&refresh_token=${refresh_token}`);
  });

  // Route to fetch emails from Gmail using the access token
  fastify.get('/emails', async (request, reply) => {
    const { access_token } = request.query;
    if (!access_token) {
      return reply.status(400).send({ message: 'Access token is missing' });
    }

    try {
      // Fetch the list of message IDs from Gmail
      const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages';
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const messageIds = response.data.messages || [];
      const emails = [];

      // Fetch details for each email
      for (const message of messageIds) {
        const emailDetails = await fetchEmailDetails(message.id, access_token);
        emails.push(emailDetails);
      }

      return reply.send(emails);
    } catch (error) {
      return reply.status(500).send({ message: 'Error fetching emails', error: error.message });
    }
  });
}

export default googleAuthRoutes;
