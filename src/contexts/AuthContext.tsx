import { url } from "@/constants";
import Router from "next/router";

import { destroyCookie, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

type SignInCredentials = {
  email: string;
  password: string;
};

interface User {
  email: string;
  // permissions: string[];
  // roles: string[];
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User | undefined;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export const signOut = () => {
  destroyCookie(undefined, "nextauth.token");

  authChannel.postMessage("signOut");

  Router.push("/login");
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          authChannel.close();
          break;
        default:
          break;
      }
    };
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await fetch(`${url}/Users/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const { token } = await response.json();

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        email,
      });

      Router.push("/");
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
