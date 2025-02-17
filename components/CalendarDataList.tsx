import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  useColorScheme,
  ColorSchemeName,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { mainGray, primaryOrange, tabGray } from "@/constants/Colors";
import { convertUTCToLocal } from "@/lib/utils";
import { AiringSchedule } from "@/api/model";

interface CalendarDataListProps {
  data: AiringSchedule[];
  showGrid: boolean;
}

const CalendarDataList: React.FC<CalendarDataListProps> = ({
  data,
  showGrid,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="h-full">
      {showGrid ? (
        <FlatList
          key="grid"
          data={Array.from(
            new Map(data.map((anime) => [anime.id, anime])).values()
          )}
          renderItem={({ item }) => (
            <GridItem item={item} colorScheme={colorScheme} />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      ) : (
        <FlatList
          key="list"
          className="h-full first:rounded-t-xl last:rounded-b-xl"
          data={data}
          renderItem={(schedule) => (
            <View
              className="flex flex-row items-center border-b-[1px]"
              style={{
                borderColor: colorScheme === "dark" ? "black" : "white",
                backgroundColor: colorScheme === "dark" ? tabGray : mainGray,
              }}
            >
              <Image
                width={80}
                height={120}
                source={{ uri: schedule.item.media.coverImage.extraLarge }}
                className="pl-3 py-3"
              />
              <View className="pl-3 pb-2">
                <Text
                  style={{
                    color: colorScheme === "dark" ? "#fff" : "#000",
                  }}
                  className="text-lg font-semibold line-clamp-1 max-w-72 pb-1"
                >
                  {schedule.item.media.title.english ||
                    schedule.item.media.title.romaji ||
                    schedule.item.media.title.native}
                </Text>
                <Text
                  style={{
                    color: colorScheme === "dark" ? "#aaa" : "#4b5563",
                  }}
                  className="text-md max-w-72 line-clamp-1"
                >
                  {convertUTCToLocal(
                    schedule.item.airingAt
                  ).toLocaleTimeString()}
                </Text>
              </View>
              <Octicons
                name="chevron-right"
                size={24}
                color={primaryOrange}
                className="ml-auto pr-5"
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
        />
      )}
    </View>
  );
};

export default CalendarDataList;

const GridItem = ({
  item,
  colorScheme,
}: {
  item: AiringSchedule;
  colorScheme: ColorSchemeName;
}) => {
  return (
    <View className="flex-1 p-2 max-w-[50%]">
      <Image
        className="w-full aspect-[2/3] rounded-lg"
        source={{ uri: item.media.coverImage.extraLarge }}
      />
      <Text
        className={`text-lg font-semibold pt-2 text-center line-clamp-1 ${
          colorScheme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {item.media.title.english ||
          item.media.title.romaji ||
          item.media.title.native}
      </Text>
      <Text
        className={`text-md text-center pb-2 line-clamp-2 ${
          colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {convertUTCToLocal(item.airingAt).toLocaleTimeString()}
      </Text>
    </View>
  );
};
