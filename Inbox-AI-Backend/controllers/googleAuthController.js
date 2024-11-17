import { google } from "googleapis";
import { oauth2Client, scopes } from "../utils/googleAuthConfig.js";

export const handleGoogleAuth = async (request, reply) => {
  try {
    // Generate the URL for Google OAuth
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    // Send the URL back as a JSON response
    reply.send({ url });
  } catch (error) {
    console.log(error);
    reply.status(500).send({ error: "Failed to generate auth URL" });
  }
};

export const handleGoogleCallback = async (request, reply) => {
  try {
    const { code } = request.query;

    if (!code) {
      return reply.status(400).send({ error: "Code parameter is missing" });
    }

    // Get the tokens using the authorization code
    const { tokens } = await oauth2Client.getToken(code);

    // Send the tokens in the response (or redirect the user to a frontend page with these tokens)
    // Optionally, you can store the tokens in a session or send them in the response
    reply.redirect(`/auth-success?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
  } catch (error) {
    console.error("Error exchanging token:", error);
    reply.status(500).send({ error: "Failed to exchange token" });
  }
};
