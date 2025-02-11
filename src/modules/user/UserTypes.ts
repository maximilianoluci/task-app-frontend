export type LoginUser = {
  email: string;
  password: string;
};

export type RegisterUser = LoginUser & {
  name: string;
};

export type User = RegisterUser & {
  id: string;
};
