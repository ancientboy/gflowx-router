/** new-api `GET /api/user/self` data 字段（节选前端用到的键） */
export type UserSelf = {
  id: number
  username: string
  display_name: string
  role: number
  status: number
  group: string
  quota: number
  used_quota: number
  request_count: number
}

export type PageInfo<T> = {
  page: number
  page_size: number
  total: number
  items: T[]
}

export type TokenRow = {
  id: number
  name: string
  key: string
  status: number
  remain_quota: number
  unlimited_quota: boolean
  used_quota: number
  group: string
  created_time: number
  expired_time: number
}
