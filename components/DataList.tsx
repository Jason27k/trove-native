import React, { useState, useEffect, Suspense } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  useColorScheme,
  Pressable,
  ColorSchemeName,
} from "react-native";
import { Link, useNavigation } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { mainGray, primaryOrange, tabGray } from "@/constants/Colors";
import { SearchQueryVariables } from "@/api/api";
import { fetchSearch } from "@/api/api";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import SuspenseDataList from "./SuspenseDataList";
import { MediaDisplay } from "@/api/model";

interface DataListProps {
  queryKey: string;
  variables: SearchQueryVariables;
  title?: string;
  stepsBack: number;
}

const DataList: React.FC<DataListProps> = ({
  queryKey,
  variables,
  title,
  stepsBack,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleHeaderButtonClick = () => {
    setShowGrid((prev) => !prev);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleHeaderButtonClick}>
          <Ionicons
            name={showGrid ? "list" : "grid"}
            size={24}
            color={primaryOrange}
          />
        </Pressable>
      ),
    });
  }, [navigation, showGrid]);

  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: ({ pageParam }) => {
        const newVars: SearchQueryVariables = {
          page: pageParam,
          ...variables,
        };
        return fetchSearch(newVars);
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

  const onReachEnd = () => {
    if (isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };

  if (error) {
    return <Text>Error</Text>;
  }

  if (!data || !data.pages) {
    return <SuspenseDataList showGrid={showGrid} colorScheme={colorScheme} />;
  }

  return (
    <Suspense
      fallback={
        <SuspenseDataList showGrid={showGrid} colorScheme={colorScheme} />
      }
    >
      <View>
        {title && (
          <Text
            className="text-3xl font-semibold pb-4"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            {title}
          </Text>
        )}
        {showGrid ? (
          <FlatList
            key="grid"
            data={extractAndDeDuplicatedAnimes(data)}
            renderItem={({ item: media }) => (
              <GridItem
                media={media}
                colorScheme={colorScheme}
                stepsBack={stepsBack}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            onEndReached={onReachEnd}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <FlatList
            key="list"
            className="h-full first:rounded-t-xl last:rounded-b-xl"
            data={extractAndDeDuplicatedAnimes(data)}
            renderItem={({ item: media }) => (
              <Link
                href={`${".".repeat(stepsBack)}/${media.id}`}
                asChild
                relativeToDirectory
              >
                <Pressable
                  className="flex flex-row items-center border-b-[1px]"
                  style={{
                    borderColor: colorScheme === "dark" ? "black" : "white",
                    backgroundColor:
                      colorScheme === "dark" ? tabGray : mainGray,
                  }}
                >
                  <Image
                    width={80}
                    height={120}
                    source={{ uri: media.coverImage.extraLarge }}
                    className="pl-3 py-3"
                  />
                  <View className="pl-3 pb-2">
                    <Text
                      style={{
                        color: colorScheme === "dark" ? "#fff" : "#000",
                      }}
                      className="text-lg font-semibold line-clamp-1 max-w-72 pb-1"
                    >
                      {media.title.english ||
                        media.title.romaji ||
                        media.title.native}
                    </Text>
                    <Text
                      style={{
                        color: colorScheme === "dark" ? "#aaa" : "#4b5563",
                      }}
                      className="text-md max-w-72 line-clamp-1"
                    >
                      {media.genres.join(", ")}
                    </Text>
                  </View>
                  <Octicons
                    name="chevron-right"
                    size={24}
                    color={primaryOrange}
                    className="ml-auto pr-5"
                  />
                </Pressable>
              </Link>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            onEndReached={onReachEnd}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </Suspense>
  );
};

export const GridItem = ({
  media,
  colorScheme,
  stepsBack,
}: {
  media: MediaDisplay;
  colorScheme: ColorSchemeName;
  stepsBack: number;
}) => {
  return (
    <Link
      href={`${".".repeat(stepsBack)}/${media.id}`}
      asChild
      relativeToDirectory
    >
      <Pressable className="flex-1 p-2 max-w-[50%]">
        <Image
          className="w-full aspect-[2/3] rounded-lg"
          source={{ uri: media.coverImage.extraLarge }}
        />
        <Text
          className={`text-lg font-semibold pt-2 text-center line-clamp-1 ${
            colorScheme === "dark" ? "text-white" : "text-black"
          }`}
        >
          {media.title.english || media.title.romaji || media.title.native}
        </Text>
        <Text
          className={`text-md text-center pb-2 line-clamp-2 ${
            colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {media.description ? media.description.replace(/<[^>]*>/g, "") : ""}
        </Text>
      </Pressable>
    </Link>
  );
};

export default DataList;
