import api from './axiosInstance'

export interface ShippingMethod {
  name: string
  cost: number
  deliveryTime: string
}

export interface ShippingDetails {
  addressToShip: string
  phoneNumber: string
}

export interface OrderItem {
  id: number
  catalogItemId: number
  unitPrice: number
  quantity: number
  productName: string
  orderId: number
  totalPrice: number
}

export interface Order {
  id: number
  userId: string
  orderDate: string
  isConfirmed: boolean
  shippingMethod: ShippingMethod
  shippingDetails: ShippingDetails
  items: OrderItem[]
  totalPrice: number
}

export const ordersApi = {
  getAll: () =>
    api.get<Order[]>('/api/Order/GetOrders'),

  getById: (orderId: number) =>
    api.get<Order>(`/api/Order/GetOrderById/${orderId}`),

  getByUserId: (userId: string) =>
    api.get<Order>(`/api/Order/GetOrderByUserId/${userId}`),

  confirm: (orderId: number) =>
    api.post(`/api/Order/ConfirmOrder/${orderId}`),
}
