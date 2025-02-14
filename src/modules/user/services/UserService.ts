import type { CreateUser, SignInUser, UserId } from "@/modules/user/types/UserTypes";
import { get, post } from "@/network";

export default class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async create(user: CreateUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/user`, user);
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: SignInUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/auth/sign-in`, user);
    } catch (error) {
      throw error;
    }
  }

  async getUser(id: string): Promise<UserId> {
    try {
      return await get(`${import.meta.env.VITE_API_URL}/user/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
