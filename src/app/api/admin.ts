import { axiosClassic } from './interceptors'

class AdminService {
  private BASE_URL = '/admin'

  async login(password: string) {
    try {
      const response = await axiosClassic.post(`${this.BASE_URL}/login`, { password });
      return response.data;
    } catch (error) {
      throw new Error('Invalid password');
    }
  }

}

export const adminService = new AdminService()