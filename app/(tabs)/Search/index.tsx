import { fetchSearch, SearchQueryVariables } from "@/api/api";
import { GridItem } from "@/components/DataList";
import ThemedView from "@/components/ThemedView";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";

const Search = () => {
  const colorScheme = useColorScheme();

  const { data, isPending, isError, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["top"],
      queryFn: ({ pageParam }) => {
        const variables: SearchQueryVariables = {
          page: pageParam,
          sort: ["SCORE_DESC"],
        };
        return fetchSearch(variables);
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

  if (isPending) {
    return (
      <ThemedView>
        <FlatList
          key="grid"
          className="h-full"
          data={[...Array(10)]}
          renderItem={() => (
            <View className="w-1/2 p-2 h-full">
              <View className="flex flex-col items-center">
                <Text className="w-[170px] h-[255px] bg-gray-200 rounded-lg dark:bg-gray-700 mb-3" />
                <Text className="bg-gray-200 rounded-full dark:bg-gray-700 text-lg font-semibold pt-2 text-center w-[170px] mb-2"></Text>
              </View>
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      </ThemedView>
    );
  }

  if (isError || !data) {
    return <ThemedView>Error</ThemedView>;
  }

  const onReachEnd = () => {
    console.log("onReachEnd");
    if (isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };

  return (
    <ThemedView>
      <FlatList
        key="grid"
        data={extractAndDeDuplicatedAnimes(data)}
        renderItem={({ item: media }) => (
          <GridItem media={media} colorScheme={colorScheme} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        onEndReached={onReachEnd}
        onEndReachedThreshold={0.5}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default Search;
