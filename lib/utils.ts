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
