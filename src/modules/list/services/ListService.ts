import type { CreateList } from "@/modules/list/types/ListTypes";
import { get, post } from "@/network";

export default class ListService {
  private static instance: ListService;

  private constructor() {}

  public static getInstance(): ListService {
    if (!ListService.instance) {
      ListService.instance = new ListService();
    }
    return ListService.instance;
  }

  async create(list: CreateList) {
    try {
      return await post(`${import.meta.env.VITE_API_URL}/list`, list);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await get(`${import.meta.env.VITE_API_URL}/list`);
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await get(`${import.meta.env.VITE_API_URL}/list/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
