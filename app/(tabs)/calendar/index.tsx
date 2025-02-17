import {
  View,
  Text,
  useColorScheme,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import ThemedView from "@/components/ThemedView";
import React, { Suspense, useEffect, useState } from "react";
import { convertUTCToLocal, getWeekRangeFromToday } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSchedule } from "@/api/api";
import CalendarDataList from "@/components/CalendarDataList";
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { mainGray, primaryOrange } from "@/constants/Colors";
import DataList from "@/components/DataList";
import SuspenseDataList from "@/components/SuspenseDataList";

const MIN_MEMBERS = 2000;

const Calendar = () => {
  const offset = new Date().getDay();
  const [currentDay, setCurrentDay] = useState(new Date().getDay() + offset);
  const colorScheme = useColorScheme();
  const [showGrid, setShowGrid] = useState(true);
  const navigation = useNavigation();
  const { startOfWeek, endOfWeek } = getWeekRangeFromToday();

  const { data, error, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery({
      queryKey: ["calendar"],
      queryFn: ({ pageParam }) =>
        fetchSchedule(startOfWeek, endOfWeek, pageParam),
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
    });

  useEffect(() => {
    if (hasNextPage && (!isFetching || !isPending)) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, isPending, fetchNextPage]);

  const handleHeaderButtonClick = () => {
    setShowGrid((prev) => !prev);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleHeaderButtonClick} className="">
          <Ionicons
            name={showGrid ? "list" : "grid"}
            size={24}
            color={primaryOrange}
          />
        </Pressable>
      ),
    });
  }, [navigation, showGrid]);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (isFetching || isPending) {
    return (
      <ThemedView>
        <View className="flex flex-col">
          <Text
            className="text-3xl font-semibold pb-1 pl-2"
            style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
          >
            {days[currentDay % 7]}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="ml-2 py-4"
          >
            {days.map((day, index) => (
              <Pressable
                key={index}
                onPress={() => setCurrentDay(index)}
                style={{
                  backgroundColor:
                    currentDay % 7 === index ? primaryOrange : mainGray,
                }}
                className={`px-4 py-2 mr-3 rounded-lg`}
              >
                <Text
                  className={`text-lg font-medium ${
                    currentDay % 7 === index ? "text-white" : "text-black"
                  }`}
                >
                  {day}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <FlatList
          data={Array.from({ length: 10 })}
          renderItem={() => (
            <SuspenseDataList showGrid={showGrid} colorScheme={colorScheme} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </ThemedView>
    );
  }

  if (error || !data) {
    return <Text>Error:</Text>;
  }

  return (
    <ThemedView>
      <View className="flex flex-col">
        <Text
          className="text-3xl font-semibold pb-1 pl-2"
          style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
        >
          {days[currentDay % 7]}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="ml-2 py-4"
        >
          {days.map((day, index) => (
            <Pressable
              key={index}
              onPress={() => setCurrentDay(index)}
              style={{
                backgroundColor:
                  currentDay % 7 === index ? primaryOrange : mainGray,
              }}
              className={`px-4 py-2 mr-3 rounded-lg`}
            >
              <Text
                className={`text-lg font-medium ${
                  currentDay % 7 === index ? "text-white" : "text-black"
                }`}
              >
                {day}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="h-[85%]">
        <CalendarDataList
          showGrid={showGrid}
          data={data.pages
            .flatMap((page) => page.data.Page.airingSchedules)
            .filter(
              (schedule) =>
                convertUTCToLocal(schedule.airingAt).getDay() === currentDay % 7
            )
            .filter((schedule) => {
              return (
                schedule.media.popularity >= MIN_MEMBERS &&
                (schedule.media.format === "TV" ||
                  schedule.media.format === "ONA") &&
                schedule.media.type === "ANIME" &&
                schedule.media.popularity >= MIN_MEMBERS
              );
            })}
        />
      </View>
    </ThemedView>
  );
};

export default Calendar;
