import { User } from "@/types/User";
import { LoginFormValues } from "@/utils/validation/loginSchema";
import { SignUpFormValues } from "@/utils/validation/signUpSchema";
import { router } from "expo-router";
import { createContext, ReactNode, useContext, useState } from "react";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: LoginFormValues) => void;
  signUp: (data: SignUpFormValues) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({
    id: "1",
    email: "marcrobertjohn@gmail.com",
    firstName: "Marc",
    surname: "Brolly",
  });

  const login = (data: LoginFormValues) => {
    const fakeUser = {
      id: "1",
      email: "marcrobertjohn@gmail.com",
      firstName: "Marc",
      surname: "Brolly",
    };

    if (
      data.email === "marcrobertjohn@gmail.com" &&
      data.password === "Testing123!!"
    ) {
      setUser(fakeUser);
      router.navigate("/(tabs)/profile");
    }
  };

  const signUp = (data: SignUpFormValues) => {
    const newUser = {
      id: "1",
      email: data.email,
      firstName: data.firstName,
      surname: data.surname,
    };

    setUser(newUser);
    console.log("Sign up successful");
    router.navigate("/(tabs)/profile");
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ login, logout, signUp, setUser, user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUserContext must be inside UserProvider");

  return context;
};
