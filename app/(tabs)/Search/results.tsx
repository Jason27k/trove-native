import ThemedView from "@/components/ThemedView";
import {
  View,
  Text,
  TextInput,
  useColorScheme,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  ColorSchemeName,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { mainGray, primaryOrange, tabGray } from "@/constants/Colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { animeSearch } from "@/api/api";
import { StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { extractAndDeDuplicatedAnimes } from "@/lib/utils";
import { MediaDisplay } from "@/api/model";

const fetchSearch = async ({ pageParam = 1 }, search: string) => {
  console.log("fetchSearch", pageParam, search);
  const variables = {
    genres: undefined,
    year: undefined,
    search: search,
    season: undefined,
    seasonYear: undefined,
    page: pageParam,
    sort: undefined,
  };
  const response = await animeSearch(variables);
  return response;
};

const Search = () => {
  const [search, setSearch] = useState("");
  const [searches, setSearches] = useState<string[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleHeaderButtonClick = () => {
    setShowGrid((prev) => {
      return !prev;
    });
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
  }, [navigation, showGrid, setShowGrid]);

  useEffect(() => {
    getSearches().then((searches) => {
      setSearches(searches);
    });
  }, []);

  const handleSearchChange = (text: string) => {
    setSearch(text);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      setShowResults(text.length > 0);
      if (text.length === 0) {
        return;
      }
      handleSearchSubmit(text);
    }, 2000);

    setTimer(newTimer);
  };

  const handleSearchSubmit = (text: string) => {
    storeSearch(text);
  };

  const handleClear = async () => {
    await AsyncStorage.setItem("searches", JSON.stringify([]));
    setSearches([]);
  };

  const getSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem("searches");
      return storedSearches ? JSON.parse(storedSearches) : [];
    } catch (error) {
      console.error("Error fetching searches from AsyncStorage:", error);
      return [];
    }
  };

  const storeSearch = async (text: string) => {
    try {
      const searches = await getSearches();
      const updatedSearches = [text, ...searches.splice(0, 9)];
      await AsyncStorage.setItem("searches", JSON.stringify(updatedSearches));
      setSearches(updatedSearches);
    } catch (error) {
      console.error("Error saving search to AsyncStorage:", error);
    }
  };

  const handleClearInput = () => {
    setSearch("");
    setShowResults(false);
  };

  const onReachEnd = () => {
    if (isFetching || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["search", search],
      queryFn: ({ pageParam }) => fetchSearch({ pageParam }, search),
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
      enabled: showResults,
    });

  if (error) {
    return (
      <Text style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}>
        Error fetching data
      </Text>
    );
  }

  return (
    <ThemedView>
      <View className="flex flex-row justify-between">
        <View className="flex flex-row items-end gap-4 h-7">
          <FontAwesome6
            name="magnifying-glass"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
          <TextInput
            placeholder="Anime Name"
            className="text-xl"
            selectionColor={primaryOrange}
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
            value={search}
            onChangeText={handleSearchChange}
          />
        </View>
        <Pressable onPress={handleClearInput}>
          <Octicons name="x-circle-fill" size={24} color={primaryOrange} />
        </Pressable>
      </View>
      <View className="h-full">
        {!showResults || !data ? (
          <View>
            <View className="flex flex-row justify-between pt-10">
              <Text
                style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
                className="text-xl"
              >
                Recent Searches
              </Text>
              <Pressable onPress={handleClear}>
                <Text style={{ color: primaryOrange }} className="text-xl">
                  Clear
                </Text>
              </Pressable>
            </View>
            <FlatList
              data={searches}
              renderItem={({ item }) => (
                <View className="flex flex-row justify-between pb-4 border-b-[0.2px] border-[#cac6c6]">
                  <Pressable
                    onPress={() => {
                      setSearch(item);
                      setShowResults(true);
                      handleSearchSubmit(item);
                    }}
                  >
                    <Text
                      style={{
                        color: colorScheme === "dark" ? "#fff" : "#000",
                      }}
                      className="text-lg"
                    >
                      {item}
                    </Text>
                  </Pressable>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              className="pt-4"
            />
          </View>
        ) : (
          <View className="pt-4 mb-10 h-full">
            {showGrid ? (
              <FlatList
                key="grid"
                className="mb-4"
                data={extractAndDeDuplicatedAnimes(data)}
                renderItem={({ item: media }) => (
                  <GridItem media={media} colorScheme={colorScheme} />
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
                renderItem={({ item: media }) => {
                  return (
                    <View
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
                    </View>
                  );
                }}
                keyExtractor={(item) => item.id.toString()}
                numColumns={1}
                onEndReached={onReachEnd}
                onEndReachedThreshold={0.5}
              />
            )}
            <View className="flex flex-row justify-center h-6">
              <Text style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}>
                {""}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ThemedView>
  );
};

const GridItem = ({
  media,
  colorScheme,
}: {
  media: MediaDisplay;
  colorScheme: ColorSchemeName;
}) => {
  return (
    <View className="flex-1 p-2 max-w-[50%]">
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
    </View>
  );
};
export default Search;
