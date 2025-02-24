import {
  ColorSchemeName,
  FlatList,
  Image,
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
import { mainGray, primaryOrange, secondaryOrange } from "@/constants/Colors";
import { Link } from "expo-router";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import SuspenseHome from "@/components/SuspenseHome";
import { Suspense } from "react";
import { MediaDisplay } from "@/api/model";

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
    return <SuspenseHome colorScheme={colorScheme} />;
  }

  if (error || topError || upcomingError) {
    return <Text>Error</Text>;
  }

  return (
    <ThemedView>
      <Suspense fallback={<SuspenseHome colorScheme={colorScheme} />}>
        <ScrollView>
          <View className="flex flex-row justify-between">
            <Link href="/home/trending" asChild>
              <Pressable className="pb-4">
                <Text
                  className="text-3xl font-semibold"
                  style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
                >
                  Featured Anime
                </Text>
              </Pressable>
            </Link>
            <Link href="/home/trending" asChild>
              <Pressable>
                <Octicons
                  name="chevron-right"
                  size={24}
                  color={colorScheme === "dark" ? primaryOrange : "#000"}
                />
              </Pressable>
            </Link>
          </View>
          <HorizontalList
            data={extractAndDeDuplicatedAnimes(data)}
            colorScheme={colorScheme}
          />
          <View className="flex flex-row justify-between py-4">
            <Link push href="/home/top" asChild>
              <Pressable className="pb-2">
                <Text
                  className="text-3xl font-semibold"
                  style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
                >
                  All Time Popular
                </Text>
              </Pressable>
            </Link>
            <Link href="/home/top" asChild>
              <Pressable>
                <Octicons
                  name="chevron-right"
                  size={24}
                  color={colorScheme === "dark" ? primaryOrange : "#000"}
                />
              </Pressable>
            </Link>
          </View>
          <HorizontalList
            data={extractAndDeDuplicatedAnimes(topData)}
            colorScheme={colorScheme}
          />
          <View className="flex flex-row justify-between pt-6 pb-4">
            <Link href="/home/upcoming" asChild>
              <Pressable>
                <Text
                  className="text-3xl font-semibold pb-4"
                  style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
                >
                  Upcoming Anime
                </Text>
              </Pressable>
            </Link>
            <Link href="/home/upcoming" asChild>
              <Pressable>
                <Octicons
                  name="chevron-right"
                  size={24}
                  color={colorScheme === "dark" ? primaryOrange : "#000"}
                />
              </Pressable>
            </Link>
          </View>
          <HorizontalList
            data={extractAndDeDuplicatedAnimes(upcomingData)}
            colorScheme={colorScheme}
          />
        </ScrollView>
      </Suspense>
    </ThemedView>
  );
}

const HorizontalList = ({
  data,
  colorScheme,
}: {
  data: MediaDisplay[];
  colorScheme: ColorSchemeName;
}) => {
  return (
    <FlatList
      data={data}
      renderItem={(media) => (
        <Link href={`./${media.item.id}`} asChild relativeToDirectory>
          <Pressable className="w-[42vw] pr-4">
            <Image
              className="w-full aspect-[2/3] rounded-lg"
              source={{
                uri: media.item.coverImage.extraLarge,
              }}
            />
            <Text
              style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
              className="text-lg font-semibold pt-2 text-center line-clamp-1"
            >
              {media.item.title.english || media.item.title.native}
            </Text>
            <Text
              style={{
                color: colorScheme === "dark" ? mainGray : "#4b5563",
              }}
              className="text-md text-center pb-2 line-clamp-2"
            >
              {media.item.description.replace(/<[^>]*>/g, "")}
            </Text>
          </Pressable>
        </Link>
      )}
      keyExtractor={(item) => item.idMal.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
};
