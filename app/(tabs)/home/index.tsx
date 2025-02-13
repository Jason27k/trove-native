import { FlatList, Image, Text, useColorScheme, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedView from "@/components/ThemedView";
import { animeSearch, fetchSearch, SearchQueryVariables } from "@/api/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { primaryOrange, secondaryOrange } from "@/constants/Colors";
import { Link } from "expo-router";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";

const fetchTop = async () => {
  const response = await animeSearch({
    sort: ["SCORE_DESC"],
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

  if (isPending || topPending) {
    console.log("loading");
    return <Text>Loading...</Text>;
  }

  if (error || topError) {
    return <Text>Error</Text>;
  }

  return (
    <ThemedView>
      <View className="flex flex-row justify-between">
        <Link href="/home/trending" className="pb-4">
          <Text
            className="text-3xl font-semibold"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            Featured Anime
          </Text>
        </Link>
        <Link href="/home/trending">
          <Octicons
            name="chevron-right"
            size={24}
            color={colorScheme === "dark" ? primaryOrange : "#000"}
          />
        </Link>
      </View>
      <View>
        <FlatList
          data={extractAndDeDuplicatedAnimes(data)}
          renderItem={(media) => (
            <View className="pr-2">
              <Image
                style={{ width: 120, height: 210 }}
                className="rounded-2xl"
                source={{
                  uri: media.item.coverImage.extraLarge,
                }}
              />
            </View>
          )}
          keyExtractor={(item) => item.idMal.toString()}
          horizontal={true}
        />
      </View>
      <View className="flex flex-row justify-between py-4">
        <Link push href="/home/top" className="pb-2">
          <Text
            className="text-3xl font-semibold"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            All Time Popular
          </Text>
        </Link>
        <Link href="/home/top">
          <Octicons
            name="chevron-right"
            size={24}
            color={colorScheme === "dark" ? primaryOrange : "#000"}
          />
        </Link>
      </View>
      <View>
        {extractAndDeDuplicatedAnimes(topData)
          .slice(0, 3)
          .map((media) => (
            <View
              style={{ backgroundColor: secondaryOrange }}
              className="rounded-3xl flex flex-row mb-3"
              key={media.id}
            >
              <Image
                source={{
                  uri: media.coverImage.extraLarge,
                }}
                style={{ width: 75, height: 100 }}
                className="rounded-full object-none my-2 mx-3"
              />
              <View className="pl-3 pb-4 flex flex-col justify-center">
                <Text className="text-lg font-semibold text-black line-clamp-1 max-w-64">
                  {media.title.english ?? media.title.native}
                </Text>
                <Text className="text-black text-md">
                  Episodes: {media.episodes}
                </Text>
                {media.averageScore ? (
                  <Text className="text-black text-md">
                    Rating: {media.averageScore / 10}
                  </Text>
                ) : (
                  <Text className="text-black text-md">
                    {media.season} {media.seasonYear}
                  </Text>
                )}
              </View>
            </View>
          ))}
      </View>
    </ThemedView>
  );
}
