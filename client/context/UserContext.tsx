import { loginUser, signUpUser } from "@/api/auth";
import { Login, SignUp, User } from "@/types/User";
import { createContext, ReactNode, useContext, useState } from "react";

type AuthToken = {
  token: string;
  valid: boolean;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: Login) => void;
  signUp: (data: SignUp) => void;
  authToken: AuthToken;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<AuthToken>({
    token: "",
    valid: false,
  });

  const login = async (data: Login) => {
    try {
      const res = await loginUser(data);
      setUser(res.userData);
      setAuthToken({ token: res.token, valid: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      console.log(message);
    }
  };

  const signUp = async (data: SignUp) => {
    try {
      const res = await signUpUser(data);
      setUser(res.userData);
      setAuthToken({ token: res.token, valid: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      console.log(message);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ authToken, login, logout, signUp, setUser, user }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUserContext must be inside UserProvider");

  return context;
};
