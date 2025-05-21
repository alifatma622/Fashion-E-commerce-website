export interface IProduct {
  name: string
  description: string
  newPrice: number
  oldPrice: number
  quantity: number
  images: Image[]
  categoryName: string
 color?: string;
}

export interface Image {
  imgURL: string
  description: string
  productId: string
}
