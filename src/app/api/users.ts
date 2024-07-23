import { Table, User } from '../types'
import { axiosClassic } from './interceptors'

class UserService {
  private BASE_URL = '/users'

  async createUser(user: any): Promise<User> {
    const response = await axiosClassic.post<User>(this.BASE_URL, user);
    return response.data;
  }

  async createTable(table: any): Promise<Table> {
    const response = await axiosClassic.post<Table>(`${this.BASE_URL}/table`, table);
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await axiosClassic.get<User[]>(this.BASE_URL);
    return response.data;
  }

  async getTables(): Promise<Table[]> {
    const response = await axiosClassic.get<Table[]>(`${this.BASE_URL}/table`);
    return response.data;
  }
}

export const userService = new UserService()