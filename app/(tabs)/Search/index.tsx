import { View, Text, Image, ScrollView, FlatList } from "react-native";
import React, { Suspense } from "react";
import ThemedView from "@/components/ThemedView";
import { useColorScheme } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { mainGray, primaryOrange } from "@/constants/Colors";
import { animeSearch } from "@/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import SuspenseSearch from "@/components/SuspenseSearch";

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

const Search = () => {
  const colorScheme = useColorScheme();

  const { data, isPending, error } = useInfiniteQuery({
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

  if (isPending) {
    return (
      <ThemedView>
        <SuspenseSearch colorScheme={colorScheme} />
      </ThemedView>
    );
  }

  if (error) {
    return <Text>Error</Text>;
  }

  return (
    <ThemedView>
      <Suspense fallback={<SuspenseSearch colorScheme={colorScheme} />}>
        <ScrollView alwaysBounceVertical={false}>
          <View className="flex flex-row justify-between">
            <Text
              className="text-3xl font-semibold pb-4"
              style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
            >
              Search By Genre
            </Text>
            <Octicons
              name="chevron-right"
              size={24}
              color={colorScheme === "dark" ? primaryOrange : "#000"}
            />
          </View>
          <View className="flex flex-row justify-between pb-4">
            <View
              style={{ backgroundColor: mainGray }}
              className="p-2 rounded-2xl"
            >
              <Image
                source={require("@/assets/images/action.png")}
                style={{ width: 160, height: 160 }}
                className="rounded-2xl"
              />
              <Text className="text-lg font-semibold text-black text-center pt-2">
                Action
              </Text>
              <Text className="text-md text-gray-600 text-center pb-2">
                Action description
              </Text>
            </View>
            <View
              style={{ backgroundColor: mainGray }}
              className="p-2 rounded-2xl"
            >
              <Image
                source={require("@/assets/images/fantasy.png")}
                style={{ width: 160, height: 160 }}
                className="rounded-2xl"
              />
              <Text className="text-lg font-semibold text-black text-center pt-2">
                Fantasy
              </Text>
              <Text className="text-md text-gray-600 text-center pb-2">
                Fantasy description
              </Text>
            </View>
          </View>
          <View className="flex flex-row justify-between">
            <View
              style={{ backgroundColor: mainGray }}
              className="p-2 rounded-2xl"
            >
              <Image
                source={require("@/assets/images/sci-fi.png")}
                style={{ width: 160, height: 160 }}
                className="rounded-2xl"
              />
              <Text className="text-lg font-semibold text-black text-center pt-2">
                Sci-Fi
              </Text>
              <Text className="text-md text-gray-600 text-center pb-2">
                Sci-Fi description
              </Text>
            </View>
            <View
              style={{ backgroundColor: mainGray }}
              className="p-2 rounded-2xl"
            >
              <Image
                source={require("@/assets/images/romance.png")}
                style={{ width: 160, height: 160 }}
                className="rounded-2xl"
              />
              <Text className="text-lg font-semibold text-black text-center pt-2">
                Romance
              </Text>
              <Text className="text-md text-gray-600 text-center pb-2">
                Romance description
              </Text>
            </View>
          </View>
          <View className="flex flex-row justify-between pt-6 pb-4">
            <Link href="/Search/upcoming">
              <Text
                className="text-3xl font-semibold pb-4"
                style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
              >
                Upcoming Anime
              </Text>
            </Link>
            <Link href="/Search/upcoming">
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
                <View className="pr-4">
                  <Image
                    style={{ width: 175, height: 262 }}
                    className="rounded-2xl"
                    source={{
                      uri: media.item.coverImage.extraLarge,
                    }}
                  />
                  <Text
                    style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
                    className="text-lg font-semibold pt-2 text-center max-w-[175px] line-clamp-1"
                  >
                    {media.item.title.english || media.item.title.native}
                  </Text>
                  <Text
                    style={{
                      color: colorScheme === "dark" ? mainGray : "#4b5563",
                    }}
                    className="text-md text-center pb-2 line-clamp-2 max-w-[175px]"
                  >
                    {media.item.description.replace(/<[^>]*>/g, "")}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.idMal.toString()}
              horizontal={true}
            />
          </View>
        </ScrollView>
      </Suspense>
    </ThemedView>
  );
};

export default Search;
