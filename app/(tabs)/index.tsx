import {
  FlatList,
  Image,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import ThemedView from "@/components/ThemedView";
import { animeSearch } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { secondaryOrange } from "@/constants/Colors";

const fetchTrending = async () => {
  const response = await animeSearch({
    sort: ["TRENDING_DESC"],
    page: 1,
  });
  return response;
};

const fetchTop = async () => {
  const response = await animeSearch({
    sort: ["SCORE_DESC"],
    page: 1,
  });
  return response;
};

export default function Index() {
  const colorScheme = useColorScheme();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });

  const {
    data: topData,
    isPending: topPending,
    isError: topError,
  } = useQuery({
    queryKey: ["popular"],
    queryFn: fetchTop,
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
      <ScrollView alwaysBounceVertical={false}>
        <View className="flex flex-row justify-between">
          <Text
            className="text-3xl font-semibold pb-4"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            Featured Anime
          </Text>
          <Octicons
            name="chevron-right"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </View>
        <View>
          <FlatList
            data={data.data.Page.media}
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
          <Text
            className="text-3xl font-semibold pb-2"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            All Time Popular
          </Text>
          <Octicons
            name="chevron-right"
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </View>
        <View>
          {topData.data.Page.media.slice(0, 3).map((media) => (
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
      </ScrollView>
    </ThemedView>
  );
}
