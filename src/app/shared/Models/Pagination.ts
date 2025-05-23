import { IProduct } from "./Product"

export interface Ipagination{
  pageIndex: number
  count: number
  pageNumber: number
  pageSize: number
  totalCount: number
  data: IProduct[]
}


