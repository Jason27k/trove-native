import { MediaDisplay, SearchQueryResponse } from "@/api/model";
import { InfiniteData } from "@tanstack/react-query";

export const extractAndDeDuplicatedAnimes = (
  data: InfiniteData<SearchQueryResponse>
) => {
  return deDuplicatedAnimes(extractInfiniteData(data));
};

export const extractInfiniteData = (
  data: InfiniteData<SearchQueryResponse>
) => {
  return data.pages.flatMap((page) => page.data.Page.media);
};

export const deDuplicatedAnimes = (animes: MediaDisplay[]) => {
  return Array.from(new Map(animes.map((anime) => [anime.id, anime])).values());
};

export function convertUTCToLocal(timestamp: number): Date {
  const date = new Date(timestamp * 1000);
  return date;
}

export function getWeekRangeFromToday(): {
  startOfWeek: number;
  endOfWeek: number;
} {
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startOfWeek: Math.floor(startOfWeek.getTime() / 1000),
    endOfWeek: Math.floor(endOfWeek.getTime() / 1000),
  };
}
