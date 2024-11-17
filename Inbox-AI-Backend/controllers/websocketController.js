import {
  model,
  GENERATION_CONFIG,
  SAFETY_SETTINGS,
} from "../utils/geminiConfig.js";

export const handleWebSocketConnection = async (req, reply) => {
  const { mails, message } = req.body;

  // const accessToken = req.query.access_token;
  // const refreshToken = req.query.refresh_token;
  // const tokens = {
  //   access_token: accessToken,
  //   refresh_token: refreshToken,
  // };

  // let chat;

  // const oauth2Client = new google.auth.OAuth2(
  //   process.env.GOOGLE_CLIENT_ID,
  //   process.env.GOOGLE_CLIENT_SECRET,
  //   process.env.GMAIL_REDIRECT_URL
  // );
  // oauth2Client.setCredentials(tokens);

  try {
    const chat = model.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      history: mails,
    });
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    return reply.send({message: response});
  } catch (error) {
    console.error(error.message);
  }

  // connection.on("message", async (message) => {
  //   try {
  //     const stringBuffer = message.toString("utf8", 0, message.length);
  //     const result = await chat.sendMessage(stringBuffer);
  //     const response = result.response.text();
  //     connection.send(response);
  //   } catch (error) {
  //     console.error(
  //       "Error processing Gemini message:",
  //       error,
  //       "Raw message:",
  //       message
  //     );
  //   }
  // });

  // connection.on("error", (error) => {
  //   console.log("Error occurred:", error);
  // });

  // connection.on("close", () => {
  //   console.log("Connection closed");
  // });
};
