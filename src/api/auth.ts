import api from './axiosInstance'

export interface LoginPayload {
  email: string
  password: string
}

export interface TokenPayload {
  nameId: string
  name: string
  roles: string[]
  notBefore: number
  expires: number
  issuedAt: number
}

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<{ authToken: string }>('/api/Auth/Login', data),

  getPayload: (token: string) =>
    api.get<TokenPayload>(`/api/Auth/GetPayload/${token}`),

  getCurrentUserName: () =>
    api.get<{ userName: string }>('/api/Auth/GetCurrentUserName'),
}
