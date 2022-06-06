import http from "@/utils/http";

export type Goods = {
  id: string;
  name: string;
  desc: string;
  price: string;
  picture: string;
  discount?: number;
  orderNum?: string;
};

export type RecommendType = {
  id: string;
  pictures: string[];
  title: string;
  alt: string;
  target: string;
  type: number;
}[];

export type FreshType = Goods[];

export type GuessType = {
  counts: number;
  pageSize: number;
  pages: number;
  page: number;
  items: Goods[];
};

export function getFresh(limit = 4): Promise<FreshType> {
  return http<FreshType>({
    url: "/home/new",
    data: { limit },
  });
}

export function getRecommend(): Promise<RecommendType> {
  return http<RecommendType>({
    url: "/home/hot/mutli",
  });
}

export function getGuess(page = 1, pageSize = 10): Promise<GuessType> {
  return http<GuessType>({
    url: "/home/goods/guessLike",
    data: {
      page,
      pageSize,
    },
  });
}
