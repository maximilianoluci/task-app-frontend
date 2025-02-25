import type { ChangePassword, SignInUser } from "@/modules/user/types/UserTypes";
import { post, put } from "@/network";

export default class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(user: SignInUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/auth/sign-in`, user);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(user: ChangePassword) {
    try {
      return await put(`${import.meta.env.VITE_API_URL}/auth/${user.id}/change-password`, user);
    } catch (error) {
      throw error;
    }
  }
}
