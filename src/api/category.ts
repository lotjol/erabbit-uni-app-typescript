import http from "@/utils/http";

export type EntryType = {
  id: string;
  name: string;
  icon: string;
}[];

export function getEntry(): Promise<EntryType> {
  return http<EntryType>({
    url: "/home/category/head/mutli",
  });
}
