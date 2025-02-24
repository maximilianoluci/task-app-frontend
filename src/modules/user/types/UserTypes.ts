export type User = {
  name: string;
  email: string;
};

export type UserId = User & {
  id: string;
};

export type CreateUser = User & {
  password: string;
  passwordConfirm: string;
};

export type SignInUser = {
  email: string;
  password: string;
};

export type ChangePassword = {
  id: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};
