// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase-config'; // Adjust the path accordingly
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login with email and password
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Signup with email and password
  const signup = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with username
    await updateProfile(user, { displayName: username });

    // Send email verification
    await firebaseSendEmailVerification(user);

    // Add user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      username: username,
    });

    // Sign out the user after signup to prevent unverified access
    await signOut(auth);

    return userCredential;
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Login with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user data exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      // User data doesn't exist, create it
      await setDoc(userDocRef, {
        email: user.email,
        username: user.displayName || '',
      });
    }
  };

  // Login with Apple
  const loginWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user data exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      // User data doesn't exist, create it
      await setDoc(userDocRef, {
        email: user.email,
        username: user.displayName || '',
      });
    }
  };

  // Update user data in Firestore
  const updateUserData = async (data) => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, data, { merge: true });
    // Update the userData state
    setUserData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      if (user) {
        // User is signed in, fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          // No user data found, set userData to null
          setUserData(null);
        }
      } else {
        // User is signed out
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    loginWithApple,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}