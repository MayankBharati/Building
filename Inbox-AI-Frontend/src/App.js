import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home"; // Import Home page component
import Emails from "./Components/AuthSucess"; // Import Emails page component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route for Sign-In */}
        <Route path="/emails" element={<Emails />} /> {/* Route to show emails after sign-in */}
      </Routes>
    </Router>
  );
};

export default App;
