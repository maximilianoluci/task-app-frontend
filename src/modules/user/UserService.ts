import type { LoginUser, RegisterUser } from "@/modules/user/UserTypes";
import { post } from "@/network/network";

export default class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async create(user: RegisterUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/user`, user);
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: LoginUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/user/login`, user);
    } catch (error) {
      throw error;
    }
  }
}
