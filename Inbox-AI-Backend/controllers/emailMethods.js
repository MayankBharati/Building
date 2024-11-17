import { google } from "googleapis";

export const readEmails = async (auth) => {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });

  const messages = response.data.messages;

  if (!messages) {
    console.lo("There are no messages");
    return;
  }

  const emails = await Promise.all(
    messages.map(
      async (message) => await getEmail(message.id, gmail)
    )
  );

  const emailsJson = JSON.stringify(emails, null, 2);

  return emailsJson;
};

async function getEmail(emailId, gmail) {
  const response = await gmail.users.messages.get({
    id: emailId,
    userId: "me",
  });
  const email = response.data;

  const subject = email.payload.headers.find((e) => e.name === "Subject").value;
  const from = email.payload.headers.find((e) => e.name === "From").value;
  const date = email.payload.headers.find((e) => e.name === "Date").value;

  // Extract the email body
  const body = [];
  const parts = email.payload.parts;
  if (parts && parts[0].body.size > 0) {
    const decodedBody = Buffer.from(parts[0].body.data, "base64").toString();
    body.push(decodedBody);
  }

  return {
    subject,
    from,
    date,
    body: body.join(""),
  };
}
