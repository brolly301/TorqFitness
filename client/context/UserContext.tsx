import { deleteUser, getUser, loginUser, signUpUser } from "@/api/auth";
import { Login, SignUp, User } from "@/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthToken = {
  token: string;
  valid: boolean;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: Login) => void;
  signUp: (data: SignUp) => void;
  deleteAccount: () => void;
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

  useEffect(() => {
    restoreUserSession();
  }, []);

  const restoreUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) return;

      const res = await getUser(token);

      setAuthToken({ token, valid: true });
      setUser(res.userData);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      console.log(message);

      setUser(null);
      setAuthToken({ token: "", valid: false });
      await AsyncStorage.removeItem("token");
    }
  };

  const login = async (data: Login) => {
    try {
      const res = await loginUser(data);
      setUser(res.userData);
      setAuthToken({ token: res.token, valid: true });
      await AsyncStorage.setItem("token", res.token);
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

  const deleteAccount = async () => {
    try {
      await deleteUser(authToken.token);

      await AsyncStorage.removeItem("token");

      setAuthToken({ token: "", valid: false });
      setUser(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      console.log(message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");

      setAuthToken({ token: "", valid: false });
      setUser(null);
    } catch (e) {
      console.error("Log out error:", e);
    }
  };

  return (
    <UserContext.Provider
      value={{ deleteAccount, authToken, login, logout, signUp, setUser, user }}
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
