"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PREVIEW_GUEST, type Guest } from "../auth-utils";

type AuthContextValue = {
  guest: Guest | null;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);

  const signIn = useCallback(() => setGuest(PREVIEW_GUEST), []);

  const signOut = useCallback(() => setGuest(null), []);

  const value = useMemo(
    () => ({ guest, signIn, signOut }),
    [guest, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa estar dentro do AuthProvider");
  }
  return context;
}
