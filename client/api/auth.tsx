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

export const getUser = async (token: string): Promise<AuthResponse> => {
  const res = await fetch(`${baseURL}/auth/user`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed fetch user");
  }

  return data;
};

export const deleteUser = async (token: string) => {
  return fetch(`${baseURL}/auth/user`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
