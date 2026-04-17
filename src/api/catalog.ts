import api from './axiosInstance'

export interface CatalogReview {
  id: number
  userId: string
  rating: number
  reviewText: string
  createdTime: string
  catalogItemId: number
}

export interface CatalogItem {
  id: number
  name: string
  description: string
  price: number
  pictureUrl: string
  stockQuantity: number
  catalogItemTypeName: string
  catalogItemBrandName: string
  catalogTypeId: number
  catalogBrandId: number
  reviews: CatalogReview[]
}

export interface CatalogBrand {
  id: number
  brand: string
}

export interface CatalogType {
  id: number
  type: string
}

export interface CreateItemPayload {
  name: string
  description: string
  price: number
  pictureUrl: string
  stockQuantity: number
  catalogTypeId: number
  catalogBrandId: number
}

export const catalogItemApi = {
  getAll: () =>
    api.get<CatalogItem[]>('/api/CatalogItem/GetCatalogItems'),

  getById: (id: number) =>
    api.get<CatalogItem>(`/api/CatalogItem/GetCatalogItemById/${id}`),

  create: (data: CreateItemPayload) =>
    api.post<CatalogItem>('/api/CatalogItem/CreateCatalogItem', data),

  updateDetails: (id: number, data: { name: string; description: string; price: number }) =>
    api.put(`/api/CatalogItem/UpdateCatalogItemDetails/${id}`, data),

  updateStock: (id: number, stockQuantity: number) =>
    api.put(`/api/CatalogItem/UpdateCatalogItemStockQuantity/${id}`, { stockQuantity }),

  updatePicture: (id: number, pictureUrl: string) =>
    api.put(`/api/CatalogItem/UpdateCatalogItemPictureUrl/${id}`, { pictureUrl }),

  updateBrand: (id: number, catalogBrandId: number) =>
    api.put(`/api/CatalogItem/UpdateCatalogBrand/${id}`, { catalogBrandId }),

  updateType: (id: number, catalogTypeId: number) =>
    api.put(`/api/CatalogItem/UpdateCatalogType/${id}`, { catalogTypeId }),

  delete: (id: number) =>
    api.delete(`/api/CatalogItem/DeleteCatalogItem/${id}`),
}

export const catalogBrandApi = {
  getAll: () =>
    api.get<CatalogBrand[]>('/api/CatalogBrand/GetCatalogBrands'),

  create: (brand: string) =>
    api.post<CatalogBrand>('/api/CatalogBrand/CreateCatalogBrand', { brand }),

  delete: (id: number) =>
    api.delete(`/api/CatalogBrand/DeleteCatalogBrand/${id}`),
}

export const catalogTypeApi = {
  getAll: () =>
    api.get<CatalogType[]>('/api/CatalogType/GetCatalogTypes'),

  create: (type: string) =>
    api.post<CatalogType>('/api/CatalogType/CreateCatalogType', { type }),

  delete: (id: number) =>
    api.delete(`/api/CatalogType/DeleteCatalogType/${id}`),
}
