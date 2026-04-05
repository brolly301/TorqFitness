export type User = {
  id: string;
  email: string;
  firstName: string;
  surname: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
