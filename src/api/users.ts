import api from './axiosInstance'

export interface AppUser {
  userId: string
  firstName: string
  lastName: string
  userName: string
  email: string
  profilePictureUrl: string
  roles: string[]
}

export interface UpdateProfilePayload {
  firstName: string
  lastName: string
  profilePictureUrl: string
}

export const usersApi = {
  getAll: () =>
    api.get<AppUser[]>('/api/ApplicationUser/GetAllUsers'),

  getByUserName: (userName: string) =>
    api.get<AppUser>(`/api/ApplicationUser/GetUserDetailsByUserName/${userName}`),

  getById: (userId: string) =>
    api.get<AppUser>(`/api/ApplicationUser/GetUserDetailsByUserId/${userId}`),

  update: (userId: string, data: UpdateProfilePayload) =>
    api.put(`/api/ApplicationUser/UpdateProfileInformation/${userId}`, data),
}
