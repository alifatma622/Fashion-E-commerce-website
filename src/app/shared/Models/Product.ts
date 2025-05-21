export interface IProduct {
  name: string
  description: string
  newPrice: number
  oldPrice: number
  quantity: number
  images: IImage[]
  categoryName: string
 color?: string;
}

export interface IImage {
  imgURL: string
  description: string
  productId: string
}
