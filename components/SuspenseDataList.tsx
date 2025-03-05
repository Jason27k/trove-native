import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ColorSchemeName,
} from "react-native";
import React from "react";
import { primaryOrange, tabGray, mainGray } from "@/constants/Colors";
import Octicons from "@expo/vector-icons/Octicons";

const SuspenseDataList = ({ showGrid }: { showGrid: boolean }) => {
  return (
    <View>
      {showGrid ? (
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
      ) : (
        <FlatList
          key="list"
          className="h-full first:rounded-t-xl last:rounded-b-xl"
          data={[...Array(10)]}
          renderItem={() => (
            <View className="flex flex-row items-center border-b-[1px] dark:border-black border-white dark:bg-tabGray bg-mainGray">
              <Text className="mx-2 my-2 bg-gray-200 rounded-lg dark:bg-gray-700 w-[80px] h-[120px]" />
              <Text className="text-lg font-semibold bg-gray-200 rounded-full dark:bg-gray-700 w-64 pl-3 pb-6"></Text>
              <Octicons
                name="chevron-right"
                size={24}
                color={primaryOrange}
                className="ml-auto pr-5"
              />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default SuspenseDataList;
