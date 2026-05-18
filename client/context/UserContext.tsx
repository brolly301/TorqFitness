import {
  changeUserPassword,
  deleteUser,
  getUser,
  loginUser,
  requestUserResetCode,
  resetUserPassword,
  signUpUser,
  updateUserDetails,
  verifyUserResetCode,
} from "@/api/auth";
import { UserInputType } from "@/components/profile/settings/EditProfileForm";
import { Login, SignUp, User } from "@/types/User";
import { toggleToast } from "@/utils/toggleToast";
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

type ApiError = {
  message: string;
  status: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: Login) => Promise<void>;
  signUp: (data: SignUp) => Promise<void>;
  updateUser: (data: UserInputType) => void;
  changePassword: (currentPassword: string, newPassword: string) => void;
  deleteAccount: () => void;
  requestResetCode: (email: string) => Promise<boolean>;
  verifyResetCode: (code: string, email: string) => Promise<boolean>;
  resetPassword: (password: string, email: string) => Promise<boolean>;
  authToken: AuthToken;
  logout: () => void;
  error: ApiError | null;
  setError: (msg: ApiError | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<AuthToken>({
    token: "",
    valid: false,
  });

  const [error, setError] = useState<ApiError | null>(null);

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
      setTimeout(() => {
        toggleToast({
          type: "success",
          text1: "Login Successful",
          text2: `Welcome back ${res.userData.firstName}`,
        });
      }, 800);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError({ message, status: "" });
    }
  };

  const signUp = async (data: SignUp) => {
    try {
      const res = await signUpUser(data);
      setUser(res.userData);
      setAuthToken({ token: res.token, valid: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError({ message, status: "" });
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteUser(authToken.token);

      await AsyncStorage.removeItem("token");

      setAuthToken({ token: "", valid: false });
      setUser(null);
      setTimeout(() => {
        toggleToast({
          type: "success",
          text1: "User Deleted.",
          text2: `Account has now been deleted. Please recreate your account to reaccess Torq.`,
        });
      }, 800);
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
      toggleToast({
        type: "success",
        text1: "You've now been logged out.",
        text2: `We hope to see you back again soon! `,
      });
    } catch (e) {
      console.error("Log out error:", e);
    }
  };

  const updateUser = async (userDetails: UserInputType) => {
    try {
      if (!authToken.token) return;
      const res = await updateUserDetails(userDetails, authToken.token);

      setUser((prev) => {
        if (!prev) return prev;
        return { ...prev, ...userDetails };
      });
      toggleToast({
        type: "success",
        text1: "Account updated.",
        text2: `Your new details have been saved. `,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError({ message, status: "" });
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      if (!authToken.token) return;
      const res = await changeUserPassword(
        currentPassword,
        newPassword,
        authToken.token,
      );

      toggleToast({
        type: "success",
        text1: "Password changed.",
        text2: `Please log in with your new password once you log out. `,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError({ message, status: "" });
    }
  };

  const requestResetCode = async (email: string) => {
    try {
      const res = await requestUserResetCode(email);

      toggleToast({
        type: "success",
        text1: "Reset code sent.",
        text2: `Please check your email and enter the reset code provided. `,
      });

      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError({ message, status: "" });
      return false;
    }
  };

  const verifyResetCode = async (code: string, email: string) => {
    try {
      const res = await verifyUserResetCode(code, email);

      toggleToast({
        type: "success",
        text1: "Reset code verified.",
        text2: `You can now enter your new password. `,
      });
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError({ message, status: "" });
      return false;
    }
  };

  const resetPassword = async (password: string, email: string) => {
    try {
      const res = await resetUserPassword(password, email);

      toggleToast({
        type: "success",
        text1: "Password reset.",
        text2: `Please log in with your new password. `,
      });
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError({ message, status: "" });
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        error,
        setError,
        changePassword,
        updateUser,
        deleteAccount,
        authToken,
        login,
        logout,
        signUp,
        setUser,
        user,
        requestResetCode,
        verifyResetCode,
        resetPassword,
      }}
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
