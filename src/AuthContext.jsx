import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
async function signup(username) {
  try {
    const response = await fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    


    const data = await response.json();
    setToken(data.token);
    setLocation("TABLET");

    

  } catch (error) {
    console.error("Error during signup:", error);
  }
  
}

async function authenticate() {
if (!token) {
      throw new Error("No token available");
    }

    try {
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

  
      setLocation("TUNNEL");
    } catch (error) {
      console.error("Error during authentication:", error);
      throw error;
    }
  }
  const value = { location, signup, token, authenticate};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
