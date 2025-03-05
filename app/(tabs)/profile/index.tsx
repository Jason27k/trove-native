import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import ThemedView from "@/components/ThemedView";
import { router, useFocusEffect } from "expo-router";
import { getValueFor, save } from "@/lib/secureStore";
import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/api/api";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Index = () => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTokens = async () => {
        setIsLoading(true);
        try {
          const storedToken = await getValueFor("access_token");
          const storedRefreshToken = await getValueFor("refresh_token");

          setToken(storedToken);
          setRefreshToken(storedRefreshToken);

          if (!storedToken || !storedRefreshToken) {
            console.log("No valid tokens found, redirecting to login page");
            router.replace("/profile/code");
          }
        } catch (error) {
          console.error("Error fetching tokens:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTokens();

      return () => {};
    }, [])
  );

  const handleLogout = async () => {
    try {
      await save("access_token", "");
      await save("refresh_token", "");
      await save("code", "");
      await save("user_id", "");
      setToken(null);
      setRefreshToken(null);
      router.replace("/profile/code");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const { data, isPending, error } = useQuery({
    queryKey: ["user", token],
    queryFn: async () => {
      if (!token) {
        return null;
      }
      const stats = await getUserStats(token);
      save("user_id", stats.data.Viewer.id.toString());
      return stats;
    },
    enabled: token !== null,
  });

  if (!token || !refreshToken) {
    return null; // Will redirect via the useFocusEffect
  }

  if (isLoading || isPending) {
    return (
      <ThemedView>
        <Text className="text-black dark:text-white">Loading profile...</Text>
      </ThemedView>
    );
  }

  if (error || !data || !data.data) {
    console.error("Error fetching user stats:", error);
    return (
      <ThemedView>
        <Text className="text-black dark:text-white">
          Error fetching user stats
        </Text>
      </ThemedView>
    );
  }

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.round((minutes * 10) / (60 * 24)) / 10;
    const years = Math.round((minutes * 10) / (60 * 24 * 365)) / 10;
    if (hours < 24) {
      return `${hours} Hours`;
    } else if (days < 365) {
      return `${days} Days`;
    } else {
      return `${years} Years`;
    }
  };

  return (
    <ThemedView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center mb-6 mt-2">
          <Image
            source={{
              uri:
                data.data.Viewer.avatar.large ||
                "/placeholder.svg?height=100&width=100",
            }}
            className="w-24 h-24 rounded-full border-2 border-primaryOrange"
            defaultSource={{ uri: "/placeholder.svg?height=100&width=100" }}
          />
          <Text className="text-black dark:text-white font-bold text-3xl my-3">
            {data.data.Viewer.name}
          </Text>
          <View className="flex-row mt-1">
            <View className="px-3 py-1 rounded-full mr-2 bg-primaryOrange">
              <Text className="text-white text-lg font-medium">
                Anime: {data.data.Viewer.statistics.anime.count}
              </Text>
            </View>
            <View className="bg-blue-500 dark:bg-blue-500 px-3 py-1 rounded-full">
              <Text className="text-white text-lg font-medium">
                Manga: {data.data.Viewer.statistics.manga.count}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View className="mb-6">
          <Text className="text-black dark:text-white font-semibold text-3xl mb-3">
            Anime Statistics
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%]">
              <StatCard
                title="Watched"
                value={data.data.Viewer.statistics.anime.count}
                icon={<FontAwesome name="film" size={20} color="#fff" />}
                color="bg-blue-500"
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <StatCard
                title="Watch Time"
                value={formatWatchTime(
                  data.data.Viewer.statistics.anime.minutesWatched
                )}
                icon={<FontAwesome5 name="clock" size={20} color="#fff" />}
                color="bg-pink-500"
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <StatCard
                title="Mean Score"
                value={data.data.Viewer.statistics.anime.meanScore.toFixed(1)}
                icon={<AntDesign name="star" size={20} color="#fff" />}
                color="bg-yellow-500"
              />
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-black dark:text-white font-semibold text-3xl mb-3">
            Manga Statistics
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%]">
              <StatCard
                title="Read"
                value={data.data.Viewer.statistics.manga.count}
                icon={<FontAwesome name="bookmark" size={20} color="#fff" />}
                color="bg-blue-500"
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <StatCard
                title="Chapters"
                value={data.data.Viewer.statistics.manga.chaptersRead}
                icon={<FontAwesome5 name="book-open" size={20} color="#fff" />}
                color="bg-pink-500"
              />
            </View>
            <View className="flex-1 min-w-[45%]">
              <StatCard
                title="Mean Score"
                value={data.data.Viewer.statistics.manga.meanScore.toFixed(1)}
                icon={<AntDesign name="star" size={20} color="#fff" />}
                color="bg-yellow-500"
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="mt-2 mb-4">
          <Pressable
            onPress={handleLogout}
            className="rounded-lg p-4 bg-primaryOrange"
          >
            <Text className="text-white text-center font-bold">Log Out</Text>
          </Pressable>
        </View>

        {/* Debug Section - Collapsible */}
        <TouchableOpacity className="mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-black dark:text-white font-bold">
              Debug Info
            </Text>
            <AntDesign name="barchart" size={18} color="#9CA3AF" />
          </View>
          <View className="mt-2">
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              Token: {token.substring(0, 10)}...
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Refresh: {refreshToken.substring(0, 10)}...
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <View
    className={`p-4 rounded-xl dark:bg-tabGray bg-mainGray flex-row items-center`}
  >
    <View
      className={`w-10 h-10 rounded-full ${color} items-center justify-center mr-3`}
    >
      {icon}
    </View>
    <View>
      <Text className="text-gray-500 dark:text-gray-400 text-mg">{title}</Text>
      <Text className="text-black dark:text-white font-bold text-lg">
        {value}
      </Text>
    </View>
  </View>
);

export default Index;
