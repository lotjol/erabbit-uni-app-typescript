import http from '@/utils/http'

export type EntryType = {
  id: string
  name: string
  icon: string
}[]

import type { Goods } from './goods'

export type subCategoryType = {
  id: string
  name: string
  picture?: string
  children: {
    id: string
    name: string
    brands?: string
    categories?: string
    goods: Goods[]
    parentId?: string
    parentName?: string
    picture: string
    saleProperties?: string
  }[]
}

export function getEntry(): Promise<EntryType> {
  return http<EntryType>({
    url: '/home/category/head/mutli',
  })
}

export function getSubCatetory(id: string): Promise<subCategoryType> {
  return http({
    url: '/category',
    data: { id },
  })
}
