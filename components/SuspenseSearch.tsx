import {
  View,
  Text,
  ColorSchemeName,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { primaryOrange, mainGray } from "@/constants/Colors";

const SuspenseSearch = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  return (
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
        <View style={{ backgroundColor: mainGray }} className="p-2 rounded-2xl">
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
        <View style={{ backgroundColor: mainGray }} className="p-2 rounded-2xl">
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
        <View style={{ backgroundColor: mainGray }} className="p-2 rounded-2xl">
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
        <View style={{ backgroundColor: mainGray }} className="p-2 rounded-2xl">
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
      <View className="flex flex-row justify-between pt-6 pb-4">
        <View>
          <Text
            className="text-3xl font-semibold pb-4"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            Upcoming Anime
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
      <FlatList
        data={[...Array(10)]}
        renderItem={() => (
          <View className="pr-4">
            <Text
              style={{ width: 175, height: 262 }}
              className="rounded-2xl bg-gray-200 dark:bg-gray-700 mb-2"
            />
            <Text className="text-lg font-semibold pt-2 text-center w-[175px] bg-gray-200 dark:bg-gray-700 rounded-full"></Text>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
      />
    </ScrollView>
  );
};

export default SuspenseSearch;
