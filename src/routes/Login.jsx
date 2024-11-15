import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { AuthPageView } from "liamc9npm";

const Login = ({ closeModal }) => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetEmailSent(false);
    setIsLoading(true);
    try {
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistenceType);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential.user.emailVerified) {
        handleLoginSuccess();
      } else {
        await auth.signOut();
        setError("Your email is not verified. Please verify your email.");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError("Invalid email or password. Please try again.");
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      setResetEmailSent(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError("");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
      setResetEmailSent(false);
    }
  };

  // Handle login success
  const handleLoginSuccess = () => {
    closeModal();
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        handleLoginSuccess();
      }
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  // Handle Apple sign-in
  const handleAppleSignIn = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        handleLoginSuccess();
      }
    } catch (error) {
      setError("Failed to sign in with Apple. Please try again.");
    }
  };

  // Handle user signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== reenterPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });
      await sendEmailVerification(user);

      const userData = {
        email: email,
        username: username,
      };
      await setDoc(doc(db, "users", user.uid), userData);
      await signOut(auth);

      setIsSignupComplete(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  // Modal inline styling
  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // If showSignUp is true, render the AuthPageView component
  return (
    <div style={modalBackdropStyle}>
      <div style={modalContentStyle}>
        <AuthPageView
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          username={username}
          setUsername={setUsername}
          reenterPassword={reenterPassword}
          setReenterPassword={setReenterPassword}
          error={error}
          isSignupComplete={isSignupComplete}
          isLoading={isLoading}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          handleSignup={handleSignup}
          handleLogin={handleLogin}
          setShowSignUp={setShowSignUp}
          isSignUp={showSignUp}
          onForgotPassword={handleForgotPassword}
          resetEmailSent={resetEmailSent}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          themeColor="#B08B5B"
        />
      </div>
    </div>
  );
};

export default Login;