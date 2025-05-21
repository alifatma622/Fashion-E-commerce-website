import { IProduct } from "./Product"

export interface Ipagination{
  pageNumber: number
  pageSize: number
  totalCount: number
  data: IProduct[]
}


