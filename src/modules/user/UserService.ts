import type { CreateUser, SignInUser } from "@/modules/user/UserTypes";
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

  async create(user: CreateUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/user`, user);
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: SignInUser) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/user/login`, user);
    } catch (error) {
      throw error;
    }
  }
}
