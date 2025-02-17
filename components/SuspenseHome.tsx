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
      <View>
        <FlatList
          data={[...Array(10)]}
          renderItem={() => (
            <View className="pr-2">
              <Text
                style={{ width: 120, height: 210 }}
                className="rounded-2xl bg-gray-200 dark:bg-gray-700"
              />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          horizontal={true}
        />
      </View>
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
      <View>
        {[...Array(10)].map((_, index) => (
          <View
            style={{ backgroundColor: secondaryOrange }}
            className="rounded-3xl flex flex-row mb-3"
            key={index.toString()}
          >
            <Text
              style={{ width: 75, height: 100 }}
              className="rounded-full object-none my-2 mx-3 bg-gray-200 dark:bg-gray-700"
            />
            <View className="pl-3 pb-4 flex flex-col justify-center">
              <Text className="rounded-full text-lg font-semibold text-black line-clamp-1 w-64 bg-gray-200 dark:bg-gray-700 h-12"></Text>
            </View>
          </View>
        ))}
      </View>
    </ThemedView>
  );
};

export default SuspenseHome;
