import { createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../config/firebase";

type AuthContextValue = {
  user: User | null;
  signOutUser: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  signOutUser: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signOutUser, loading }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
