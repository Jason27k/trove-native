import { View, Text, ColorSchemeName, FlatList } from "react-native";
import React from "react";
import ThemedView from "./ThemedView";
import Octicons from "@expo/vector-icons/Octicons";
import { primaryOrange, secondaryOrange } from "@/constants/Colors";

const SuspenseHome = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  return (
    <ThemedView>
      <View className="flex flex-row justify-between">
        <View className="pb-4">
          <Text
            className="text-3xl font-semibold"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            Featured Anime
          </Text>
        </View>
        <View>
          <Octicons
            name="chevron-right"
            size={24}
            color={colorScheme === "dark" ? primaryOrange : "#000"}
          />
        </View>
      </View>
      <HorizontalList />
      <View className="flex flex-row justify-between py-4">
        <View className="pb-2">
          <Text
            className="text-3xl font-semibold"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            All Time Popular
          </Text>
        </View>
        <View>
          <Octicons
            name="chevron-right"
            size={24}
            color={colorScheme === "dark" ? primaryOrange : "#000"}
          />
        </View>
      </View>
      <HorizontalList />
    </ThemedView>
  );
};

const HorizontalList = () => {
  return (
    <FlatList
      data={[...Array(10)]}
      renderItem={(media) => (
        <View className="w-[42vw] pr-4">
          <Text className="w-full aspect-[2/3] rounded-lg bg-gray-200 dark:bg-gray-700 mb-2" />
          <Text className="text-lg font-semibold pt-2 text-center line-clamp-1 bg-gray-200 dark:bg-gray-700"></Text>
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default SuspenseHome;
