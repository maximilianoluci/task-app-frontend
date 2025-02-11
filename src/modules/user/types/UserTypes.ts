export type User = {
  name: string;
  email: string;
};

export type CreateUser = User & {
  password: string;
  passwordConfirm: string;
};

export type SignInUser = {
  email: string;
  password: string;
};
