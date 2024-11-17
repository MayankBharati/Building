import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import axios from "axios";

// Home Page: For Google Login
const HomePage = () => {

  const handleLogin = async () => {
    try {
      const response = await axios.get("https://inbox-ai-backend.vercel.app/get-url");
      const authUrl = response.data.url;
      window.location.href = authUrl; // Redirect to Google Login
    } catch (error) {
      console.error("Error fetching auth URL", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-5 left-5 text-3xl font-bold text-gray-800">Earthworm.AI</div>

      <div className="absolute top-5 right-5">
        <button
          onClick={handleLogin}
          className="px-6 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

// Token Page: After login, show tokens
const TokenPage = () => {
  const [tokenDetails, setTokenDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await axios.post("https://inbox-ai-backend.vercel.app/google-callback", { code });
          setTokenDetails(response.data);
        } catch (error) {
          console.error("Error exchanging token", error);
          setError("Failed to retrieve token information.");
        }
      }
    };

    if (window.location.search.includes("code")) {
      handleCallback();
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-5 left-5 text-3xl font-bold text-gray-800">Earthworm.AI</div>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full text-center">
        {tokenDetails ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Authenticated</h2>
            <pre className="text-left bg-gray-100 p-4 rounded-lg">
              {JSON.stringify(tokenDetails, null, 2)}
            </pre>
          </>
        ) : (
          <p className="text-lg text-gray-600">Please sign in to view your token data.</p>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
        <Route path="/" exact component={HomePage} />
        <Route path="/tokens" component={TokenPage} />
    </Router>
  );
};

export default App;
