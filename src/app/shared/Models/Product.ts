export interface IProduct {
[x: string]: any
price: any
rating: number
reviewCount: any
  id(id: any): unknown
  categoryId: number
  name: string
  description: string
  newPrice: number
  oldPrice: number
  quantity: number
  images: IImage[]
  categoryName: string
}

export interface IImage {
  imgURL: string
  description: string
  productId: string
}
