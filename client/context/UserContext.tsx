import { createContext, ReactNode, useContext } from "react";

type UserContextType = {};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUserContext must be inside UserProvider");

  return context;
};
