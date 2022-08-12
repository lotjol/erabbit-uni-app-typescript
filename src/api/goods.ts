import http from '@/utils/http'

export type Goods = {
  id: string
  name: string
  desc: string
  price: string
  picture: string
  discount?: number
  orderNum?: string
}

export type RecommendType = {
  id: string
  pictures: string[]
  title: string
  alt: string
  target: string
  type: number
}[]

export type FreshType = Goods[]

export type GuessType = {
  counts: number
  pageSize: number
  pages: number
  page: number
  items: Goods[]
}

export type DetailType = {
  id: string
  name: string
  desc: string
  price: string
  oldPrice: string
  mainPictures: string[]
  brand?: {
    name: string
    picture: string
  }
  details: {
    pictures: string[]
    properties: {
      name: string
      value: string
    }[]
  }
  similarProducts: Goods[]
  hotByDay: Goods[]
  inventory: number
  specs: {
    id: string
    name: string
    values: {
      desc: string
      name: string
      picture: string
      checked?: boolean
      disabled?: boolean
    }[]
  }[]
  skus: {
    id: string
    inventory: number
    oldPrice: string
    price: string
    skuCode: string
    specs: {
      name: string
      valueName: string
    }[]
  }[]
}

export type RelationType = Goods[]

export function getFresh(limit = 4): Promise<FreshType> {
  return http<FreshType>({
    url: '/home/new',
    data: { limit },
  })
}

export function getRecommend(): Promise<RecommendType> {
  return http<RecommendType>({
    url: '/home/hot/mutli',
  })
}

export function getGuess(page = 1, pageSize = 10): Promise<GuessType> {
  return http<GuessType>({
    url: '/home/goods/guessLike',
    data: {
      page,
      pageSize,
    },
  })
}

export function getGoodsDetail(id: string): Promise<DetailType> {
  return http<DetailType>({
    url: '/goods',
    data: { id },
  })
}

export function getRelationGoods(id: string, limit: number = 8): Promise<RelationType> {
  return http<RelationType>({
    url: '/goods/relevant',
    data: { id, limit },
  })
}
