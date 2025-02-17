import { View, Text, Image, ScrollView, FlatList } from "react-native";
import React, { Suspense } from "react";
import ThemedView from "@/components/ThemedView";
import { useColorScheme } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { mainGray, primaryOrange } from "@/constants/Colors";
import { Link } from "expo-router";
import SuspenseSearch from "@/components/SuspenseSearch";

const Search = () => {
  const colorScheme = useColorScheme();

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
        </ScrollView>
      </Suspense>
    </ThemedView>
  );
};

export default Search;
