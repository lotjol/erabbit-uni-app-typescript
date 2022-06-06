import http from "@/utils/http";

export type BannerType = {
  id: string;
  type: string;
  imgUrl: string;
}[];

export function getBanner(distributionSite = 1): Promise<BannerType> {
  return http<BannerType>({
    url: "/home/banner",
    data: {
      distributionSite,
    },
  });
}
