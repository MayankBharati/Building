import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";

export const ChatInterface = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome! How can I assist you today?" },
  ]);
  const [history, setHistory] = useState(["Welcome Chat"]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: question },
        { sender: "system", text: `You asked: "${question}". We'll get back soon.` },
      ]);
      setHistory((prevHistory) => [...prevHistory, question]);
      setQuestion("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/10 backdrop-blur-md p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Earthworm AI</h2>
          <p className="text-sm text-gray-400">Connected to: user@example.com</p>
        </div>
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <a href="#" className="block py-2 px-3 rounded-lg text-gray-300 hover:bg-white/20">
                Dashboard
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="block py-2 px-3 rounded-lg text-gray-300 hover:bg-white/20">
                Settings
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="block py-2 px-3 rounded-lg text-gray-300 hover:bg-white/20">
                Logout
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white">Chat History</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              {history.map((item, index) => (
                <li key={index} className="hover:text-white cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Menu */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white/10 p-2 rounded-lg hover:bg-white/20"
          >
            <FiMenu size={24} className="text-white" />
          </button>
          {menuOpen && (
            <div className="absolute top-12 right-0 bg-gray-800 rounded-lg shadow-lg p-4 w-40">
              <ul>
                <li className="py-2 px-3 text-gray-300 hover:bg-gray-700 rounded-lg">
                  Settings
                </li>
                <li className="py-2 px-3 text-gray-300 hover:bg-gray-700 rounded-lg">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-800/50 backdrop-blur-md">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    msg.sender === "user" ? "bg-blue-600/80" : "bg-gray-700/80"
                  } p-4 rounded-lg max-w-md backdrop-blur-md`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleQuestionSubmit}
          className="bg-gray-800/50 border-t border-gray-700 p-4 backdrop-blur-md"
        >
          <div className="flex items-center space-x-4">
            <textarea
              className="flex-1 h-12 p-3 bg-gray-900/80 text-white rounded-lg resize-none border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500 backdrop-blur-md"
              placeholder="Type your message..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600/80 text-white px-6 py-2 rounded-lg hover:bg-blue-500/80 backdrop-blur-md"
            >
              Send
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
