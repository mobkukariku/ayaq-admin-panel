import api from './axiosInstance'

export interface SalesReport {
  month: string
  salesCount: number
}

export interface ActivityLog {
  userId: string
  justOrdered: boolean
  orderDate: string
}

export interface InventoryItem {
  productName: string
  stockQuantity: number
}

export const dashboardApi = {
  getSalesReport: () =>
    api.get<SalesReport[]>('/api/AdminDashboard/SalesReport'),

  getActivityLogs: () =>
    api.get<ActivityLog[]>('/api/AdminDashboard/GetCustomerActivityLogs'),

  getInventorySummary: () =>
    api.get<InventoryItem[]>('/api/AdminDashboard/GetInventorySummary'),
}
