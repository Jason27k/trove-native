import {
  ColorSchemeName,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedView from "@/components/ThemedView";
import { animeSearch, fetchSearch, SearchQueryVariables } from "@/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { mainGray, primaryOrange, secondaryOrange } from "@/constants/Colors";
import { Link } from "expo-router";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import { MotiView } from "moti";
// import SuspenseHome from "@/components/SuspenseHome";
import { Suspense } from "react";
import { MediaDisplay } from "@/api/model";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

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
  const [refreshing, setRefreshing] = React.useState(false);
  const isDark = colorScheme === "dark";

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Implement your refresh logic here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

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

  if (isPending || topPending || upcomingPending) {
    return (
      <View className="flex-1">
        <Suspense fallback={<SuspenseHome />}>
          <SuspenseHome />
        </Suspense>
      </View>
    );
    // return <SuspenseHome colorScheme={colorScheme} />;
  }

  if (error || topError || upcomingError) {
    return <Text>Error</Text>;
  }

  return (
    <View className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
      <Suspense fallback={<SuspenseHome />}>
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="px-4 pt-4">
            <SectionHeader title="Featured Anime" href="/home/trending" />
            <HorizontalList
              data={extractAndDeDuplicatedAnimes(data)}
              featured={true}
            />

            <SectionHeader title="All Time Popular" href="/home/top" />
            <HorizontalList data={extractAndDeDuplicatedAnimes(topData)} />

            <SectionHeader title="Upcoming Anime" href="/home/upcoming" />
            <HorizontalList data={extractAndDeDuplicatedAnimes(upcomingData)} />
          </View>
        </ScrollView>
      </Suspense>
    </View>
  );
}

const SectionHeader = ({ title, href }: { title: string; href: string }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-row justify-between items-center py-4">
      <Link href={href} asChild>
        <Pressable>
          <Text
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {title}
          </Text>
        </Pressable>
      </Link>
      <Link href={href} asChild>
        <Pressable className="bg-orange-500/10 rounded-full p-2">
          <Octicons
            name="chevron-right"
            size={20}
            color={isDark ? "#f97316" : "#000"}
          />
        </Pressable>
      </Link>
    </View>
  );
};

const AnimeCard = ({
  item,
  featured = false,
}: {
  item: MediaDisplay;
  featured?: boolean;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Link href={`./${item.id}`} asChild>
      <Pressable className={`${featured ? "w-[85vw]" : "w-[42vw]"} pr-4`}>
        <View className="relative">
          <Image
            className={`w-full ${
              featured ? "aspect-[16/9]" : "aspect-[2/3]"
            } rounded-xl`}
            source={{
              uri: featured
                ? item.bannerImage || item.coverImage.extraLarge
                : item.coverImage.extraLarge,
            }}
          />
          {featured && (
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-xl"
            />
          )}
          <View
            className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
              isDark ? "bg-black" : "bg-white"
            }`}
          >
            {item.averageScore && (
              <View className="flex-row items-center space-x-1">
                <Octicons name="star" size={12} color={"#f97316"} />
                <Text
                  className={`text-xs font-medium pl-1 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {item.averageScore / 10}
                </Text>
              </View>
            )}
          </View>

          <View className="pt-2">
            <Text
              className={`text-base font-semibold ${
                isDark ? "text-white" : "text-black"
              } line-clamp-1`}
            >
              {item.title.english || item.title.native}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              } line-clamp-2`}
            >
              {item.description.replace(/<[^>]*>/g, "")}
            </Text>
          </View>
          <View
            className={`absolute top-2 left-2 px-2 py-1 rounded-full ${
              item.status === "RELEASING"
                ? "bg-green-500"
                : item.status === "NOT_YET_RELEASED"
                ? "bg-blue-500"
                : "bg-gray-500"
            }`}
          >
            <Text className="text-xs font-medium text-white">
              {item.status === "RELEASING"
                ? "Airing"
                : item.status === "NOT_YET_RELEASED"
                ? "Upcoming"
                : "Completed"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
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

const SuspenseHome = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 animate-pulse">
      <View
        className={`h-8 w-48 rounded-lg mb-4 ${
          isDark ? "bg-gray-800" : "bg-gray-200"
        }`}
      />
      <View className="flex-row space-x-4">
        {[1, 2].map((i) => (
          <View
            key={i}
            className={`w-[42vw] aspect-[2/3] rounded-xl ${
              isDark ? "bg-gray-800" : "bg-gray-200"
            }`}
          />
        ))}
      </View>
    </View>
  );
};
