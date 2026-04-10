import React, { useState, useEffect } from "react";
import AuthContainer from "./AuthContainer";   // new sliding login/signup UI
import IntroPage from "./IntroPage";           // your intro page
import Dashboard from "./Dashboard";
import FloatingChatbot from "./FloatingChatbot";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowAuth(false);
  };

  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
    setShowAuth(false);
  };

  /* ------------------- AUTH FLOW ------------------- */

  // 1️⃣ If not logged in and NOT showing login/signup → Show INTRO PAGE
  if (!loggedIn && !showAuth) {
    return (
      <IntroPage
        onStart={() => setShowAuth(true)}   // When user clicks "Get Started"
      />
    );
  }

  // 2️⃣ If not logged in BUT auth UI is triggered → Show Login/Signup UI
  if (!loggedIn && showAuth) {
    return <AuthContainer onLoginSuccess={handleLoginSuccess} />;
  }

  // 3️⃣ If logged in → Dashboard
  
  return (
  <>
    <Dashboard onLogout={logout} />
    <FloatingChatbot />
  </>
);
}

export default App;