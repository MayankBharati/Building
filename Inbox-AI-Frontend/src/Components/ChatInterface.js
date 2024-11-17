import { memo, useState } from "react";

const ChatInterface = ({ mails }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const fetchResponse = async (message) => {
    try {
      const response = await fetch(`https://inbox-ai-backend.vercel.app/chatbot`, {
        method: "POST",
        body: JSON.stringify({
          mails: [
            {
              role: "user",
              parts: [
                {
                  text: `These are my emails: ${JSON.stringify(mails)}`,
                },
              ],
            },
            ...messages,
          ],
          message: message,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      const dummyTemp = {
        role: "model",
        parts: [
          {
            text: data.message,
          },
        ],
      };
      setMessages((prevMessages) => [...prevMessages, dummyTemp]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  // useEffect(() => {
  //   const wsUrl = `wss://047e-2409-40d2-60-33bd-2c09-8c83-78cd-e80b.ngrok-free.app/chatbot?access_token=${accessToken}&refresh_token=${refreshToken}`; // replace with your backend URL

  //   const ws = new W3CWebSocket(wsUrl);
  //   setWs(ws);

  //   ws.onmessage = (event) => {
  //     console.log(`Received message: ${event.data}`);
  //     console.log(event.data);
  //     setMessages((prevMessages) => [...prevMessages, event.data]);
  //   };

  //   ws.onopen = () => {
  //     console.log("Connected to WebSocket endpoint");
  //   };

  //   ws.onclose = () => {
  //     console.log(`Disconnected from WebSocket endpoint.`);
  //   };

  //   ws.onerror = (error) => {
  //     console.error("Error occurred:", error);
  //   };

  //   return () => {
  //     if (ws.readyState === 1) {
  //       ws.close();
  //     }
  //   };
  // }, []);

  const handleSendMessage = () => {
    fetchResponse(message);
    const dummyTemp = {
      role: "user",
      parts: [{ text: message }],
    };
    setMessages((prevMessages) => [...prevMessages, dummyTemp]);
    setMessage("");
  };

  return (
    <div className="h-full flex flex-col">
      {mails && mails.length > 0 ? (
        <>
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            <div className="bg-blue-50 p-4 rounded-lg max-w-[80%]">
              <p className="text-gray-800">How can I help you?</p>
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className="bg-blue-50 p-4 rounded-lg max-w-[80%]"
              >
                <p className="text-gray-800">{message.parts[0].text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <h3>Loading mails please wait.</h3>
      )}
    </div>
  );
};

export default memo(ChatInterface);
