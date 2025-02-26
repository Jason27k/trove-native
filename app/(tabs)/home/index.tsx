import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedView from "@/components/ThemedView";
import { animeSearch, fetchSearch, SearchQueryVariables } from "@/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { primaryOrange } from "@/constants/Colors";
import { Link } from "expo-router";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import SuspenseHome from "@/components/SuspenseHome";
import { Suspense } from "react";
import { MediaDisplay } from "@/api/model";
import AnimeCard from "@/components/AnimeCard";

const fetchUpcoming = async () => {
  let year = new Date().getFullYear();
  let nextSeasonYear = year;
  const month = new Date().getMonth();
  let nextSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL" = "WINTER";
  let currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL" = "FALL";

  if (month >= 0 && month < 3) {
    nextSeason = "SPRING";
    currentSeason = "WINTER";
  } else if (month >= 3 && month < 6) {
    nextSeason = "SUMMER";
    currentSeason = "SPRING";
  } else if (month >= 6 && month < 9) {
    nextSeason = "FALL";
    currentSeason = "SUMMER";
  } else {
    nextSeasonYear += 1;
  }
  const response = await animeSearch({
    seasonYear: nextSeasonYear,
    season: nextSeason,
    page: 1,
  });

  return response;
};

export default function Index() {
  const colorScheme = useColorScheme();

  const trendingVariables: SearchQueryVariables = {
    sort: ["TRENDING_DESC"],
    page: 1,
  };

  const { data, isPending, isError, error } = useInfiniteQuery({
    queryKey: ["trending"],
    queryFn: () => {
      return fetchSearch(trendingVariables);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.Page.pageInfo.hasNextPage) {
        return pages.length + 1;
      }
    },
    getPreviousPageParam: (firstPage, pages) => {
      if (firstPage.data.Page.pageInfo.currentPage > 1) {
        return pages.length - 1;
      }
    },
  });

  const topVariables: SearchQueryVariables = {
    sort: ["SCORE_DESC"],
    page: 1,
  };

  const {
    data: topData,
    isPending: topPending,
    isError: topError,
  } = useInfiniteQuery({
    queryKey: ["top"],
    queryFn: () => {
      return fetchSearch(topVariables);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.Page.pageInfo.hasNextPage) {
        return pages.length + 1;
      }
    },
    getPreviousPageParam: (firstPage, pages) => {
      if (firstPage.data.Page.pageInfo.currentPage > 1) {
        return pages.length - 1;
      }
    },
  });

  const popularVariables: SearchQueryVariables = {
    sort: ["POPULARITY_DESC"],
    page: 1,
  };

  const {
    data: popularData,
    isPending: isPopularPending,
    isError: isPopularError,
    error: popularError,
  } = useInfiniteQuery({
    queryKey: ["popular"],
    queryFn: () => {
      return fetchSearch(popularVariables);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.Page.pageInfo.hasNextPage) {
        return pages.length + 1;
      }
    },
    getPreviousPageParam: (firstPage, pages) => {
      if (firstPage.data.Page.pageInfo.currentPage > 1) {
        return pages.length - 1;
      }
    },
  });

  const {
    data: upcomingData,
    isPending: upcomingPending,
    error: upcomingError,
  } = useInfiniteQuery({
    queryKey: ["upcoming"],
    queryFn: () => fetchUpcoming(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.Page.pageInfo.hasNextPage) {
        return pages.length + 1;
      }
    },
    getPreviousPageParam: (firstPage, pages) => {
      if (firstPage.data.Page.pageInfo.currentPage > 1) {
        return pages.length - 1;
      }
    },
  });

  if (isPending || topPending || upcomingPending || isPopularPending) {
    return <SuspenseHome colorScheme={colorScheme} />;
  }

  if (error || topError || upcomingError || isPopularError) {
    return <Text>Error</Text>;
  }

  return (
    <ThemedView>
      <Suspense fallback={<SuspenseHome colorScheme={colorScheme} />}>
        <ScrollView>
          <View className="pt-4">
            <ListHeader title="Featured Anime" href="/home/trending" />
            <HorizontalList
              data={extractAndDeDuplicatedAnimes(data)}
              featured={true}
            />
          </View>

          <View className="pt-4">
            <ListHeader title="All Time Ranked" href="/home/top" />
            <HorizontalList data={extractAndDeDuplicatedAnimes(topData)} />
          </View>

          <View className="pt-4">
            <ListHeader title="Popular Anime" href="/home/popular" />
            <HorizontalList data={extractAndDeDuplicatedAnimes(popularData)} />
          </View>

          <View className="pt-4">
            <ListHeader title="Upcoming Anime" href="/home/upcoming" />
            <HorizontalList data={extractAndDeDuplicatedAnimes(upcomingData)} />
          </View>
        </ScrollView>
      </Suspense>
    </ThemedView>
  );
}

const ListHeader = ({ title, href }: { title: string; href: string }) => {
  return (
    <View className="flex flex-row justify-between">
      <Link href={href} asChild>
        <Pressable className="pb-4">
          <Text className="text-3xl font-semibold dark:text-white text-black">
            {title}
          </Text>
        </Pressable>
      </Link>
      <Link href={href} asChild>
        <Pressable>
          <Octicons name="chevron-right" size={24} color={primaryOrange} />
        </Pressable>
      </Link>
    </View>
  );
};

const HorizontalList = ({
  data,
  featured = false,
}: {
  data: MediaDisplay[];
  featured?: boolean;
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <AnimeCard item={item} featured={featured} />}
      keyExtractor={(item) => item.idMal.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="pb-2"
      className="-mx-4 px-4"
    />
  );
};
