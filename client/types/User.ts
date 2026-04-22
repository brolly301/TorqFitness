export type User = {
  userId: string;
  email: string;
  firstName: string;
  surname: string;
};

export type AuthResponse = {
  userData: User;
  token: string;
  message: string;
};

export type Settings = {
  id: string;
  theme: string;
  font: string;
  userId: string;
};

export type Login = {
  email: string;
  password: string;
};

export type SignUp = {
  email: string;
  password: string;
  firstName: string;
  surname: string;
};
