import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  useColorScheme,
  ColorSchemeName,
  Pressable,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { mainGray, primaryOrange, tabGray } from "@/constants/Colors";
import { convertUTCToLocal } from "@/lib/utils";
import { AiringSchedule } from "@/api/model";
import { Link } from "expo-router";
import AnimeCardCalendar from "./AnimeCardCalendar";

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
            new Map(data.map((anime) => [anime.media.id, anime])).values()
          )}
          renderItem={({ item }) => <AnimeCardCalendar item={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      ) : (
        <FlatList
          key="list"
          className="h-full first:rounded-t-xl last:rounded-b-xl"
          data={Array.from(
            new Map(data.map((anime) => [anime.media.id, anime])).values()
          )}
          renderItem={(schedule) => (
            <Link href={`./${schedule.item.id}`} asChild relativeToDirectory>
              <Pressable
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
              </Pressable>
            </Link>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
        />
      )}
    </View>
  );
};

export default CalendarDataList;
