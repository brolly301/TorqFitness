import { baseURL } from "@/constants/api";
import { AuthResponse, Login, SignUp } from "../types/User";

export const signUpUser = async (
  userDetails: SignUp,
): Promise<AuthResponse> => {
  const res = await fetch(`${baseURL}/auth/signUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDetails),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to sign up user");
  }

  return data;
};

export const loginUser = async (userDetails: Login): Promise<AuthResponse> => {
  const res = await fetch(`${baseURL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDetails),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to log in");
  }

  return data;
};
