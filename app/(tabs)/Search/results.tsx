import ThemedView from "@/components/ThemedView";
import {
  View,
  Text,
  TextInput,
  useColorScheme,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { mainGray, primaryOrange } from "@/constants/Colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { animeSearch } from "@/api/api";
import { StyleSheet } from "react-native";

const fetchSearch = async (search: string) => {
  const variables = {
    genres: undefined,
    year: undefined,
    search: search,
    season: undefined,
    seasonYear: undefined,
    page: 1,
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
  const colorScheme = useColorScheme();

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
    console.log("searching for", text);
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
      const updatedSearches = [
        text,
        ...(searches.length === 10 ? searches.splice(1, 10) : searches),
      ];
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

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["searches", search],
    queryFn: () => fetchSearch(search),
    enabled: showResults,
  });

  console.log(data);

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
      <View className="h-screen">
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
          <View className="py-4">
            <FlatList
              data={data.data.Page.media}
              renderItem={({ item: media }) => {
                return (
                  <View className="w-1/2 p-2">
                    <View className="flex flex-col items-center">
                      <Image
                        style={{ width: 170, height: 255 }}
                        source={{ uri: media.coverImage.extraLarge }}
                      />
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#fff" : "#000",
                        }}
                        className="text-lg font-semibold pt-2 text-center max-w-[170px] line-clamp-1"
                      >
                        {media.title.english || media.title.native}
                      </Text>
                      <Text
                        style={{
                          color: colorScheme === "dark" ? "#aaa" : "#4b5563",
                        }}
                        className="text-md text-center pb-2 line-clamp-2 max-w-[170px]"
                      >
                        {media.description.replace(/<[^>]*>/g, "")}
                      </Text>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item) => item.idMal.toString()}
              numColumns={2} // Ensure that FlatList renders two columns
              contentContainerStyle={styles.gridContainer} // Use the StyleSheet for contentContainerStyle
            />
          </View>
        )}
      </View>
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
