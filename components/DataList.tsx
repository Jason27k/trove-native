import React, { useState, useEffect, Suspense } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";
import { primaryOrange } from "@/constants/Colors";
import { SearchQueryVariables } from "@/api/api";
import { fetchSearch } from "@/api/api";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import SuspenseDataList from "./SuspenseDataList";
import AnimeCardGrid from "./AnimeCardGrid";
import AnimeHorizontal from "./AnimeHorizontal";

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
    return <SuspenseDataList showGrid={showGrid} />;
  }

  return (
    <Suspense fallback={<SuspenseDataList showGrid={showGrid} />}>
      <View>
        {title && (
          <Text className="text-3xl font-semibold pb-4 dark:text-white text-black">
            {title}
          </Text>
        )}
        {showGrid ? (
          <FlatList
            key="grid"
            data={extractAndDeDuplicatedAnimes(data)}
            renderItem={({ item: media }) => (
              <AnimeCardGrid media={media} stepsBack={stepsBack} />
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
              <AnimeHorizontal media={media} stepsBack={stepsBack} />
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

export default DataList;
