import { url } from "@/constants";
import Router from "next/router";

import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useState } from "react";
import { toast } from "react-toastify";

type AuthProviderProps = {
  children: ReactNode;
};

type SignInCredentials = {
  email: string;
  password: string;
};

interface User {
  email: string;
  name: string;
  permissions: string[];
  // roles: string[];
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User | undefined;
  isAuthenticated: boolean;
}

function getUserFromCookies(): User | undefined {
  const { "nextauth.user": userCookie } = parseCookies();

  if (userCookie) {
    try {
      return JSON.parse(userCookie) as User;
    } catch (error) {
      console.error("Failed to parse user from cookie:", error);
      signOut();
    }
  }
  return undefined;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export const signOut = () => {
  destroyCookie(undefined, "nextauth.token");

  // authChannel.postMessage("signOut");

  Router.push("/login");
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | undefined>(getUserFromCookies());
  const isAuthenticated = !!user;

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

      const { token, user } = await response.json();

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setCookie(undefined, "nextauth.user", user.id, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      const allowedRoutes = user.rotasPermitidas.map((r: any) => r.caminho);

      setCookie(
        undefined,
        "nextauth.user",
        JSON.stringify({
          email,
          name: user.name,
          permissions: allowedRoutes,
        }),
        {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        }
      );

      setUser({
        email,
        name: user.name,
        permissions: allowedRoutes,
      });

      Router.push("/");
    } catch (error) {
      toast.error("Erro ao fazer login.");
      console.error("Error during sign in:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
