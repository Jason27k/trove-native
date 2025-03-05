import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Image,
  SectionList,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Octicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import ThemedView from "@/components/ThemedView";
import { getValueFor } from "@/lib/secureStore";
import { getMediaList } from "@/api/api";
import { AnimeHorizontal } from "@/components/AnimeHorizontal";
import { primaryOrange } from "@/constants/Colors";
import MediaHorizontal from "@/components/MediaHorizontal";

const EmptyState = ({ message }: { message: string }) => (
  <View className="flex-1 items-center justify-center py-12">
    <Image
      source={require("@/assets/images/empty.jpg")}
      className="w-40 h-40 opacity-50"
      resizeMode="contain"
    />
    <Text className="text-lg text-black dark:text-white text-center mt-4">
      {message}
    </Text>
    <Link href="/search" asChild>
      <Pressable className="mt-6 bg-primaryOrange px-6 py-3 rounded-full flex-row items-center">
        <Octicons name="search" size={16} color="white" />
        <Text className="text-white font-medium ml-2">Find Anime</Text>
      </Pressable>
    </Link>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View className="py-3 px-4 bg-mainGray dark:bg-tabGray border-b border-black/10 dark:border-white/10">
    <Text className="text-lg font-bold text-black dark:text-white">
      {title}
    </Text>
  </View>
);

const ListFooter = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;

  return (
    <View className="py-6 items-center">
      <ActivityIndicator size="small" color={primaryOrange} />
    </View>
  );
};

const Liked = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUserId = async () => {
        try {
          const userId = await getValueFor("user_id");
          setUserId(userId);
        } catch (error) {
          console.error("Error fetching tokens:", error);
        }
      };

      fetchUserId();
    }, [])
  );

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["anime", userId],
    queryFn: ({ pageParam }) => {
      return getMediaList(userId, pageParam, 20, "ANIME");
    },
    enabled: userId !== null,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pageInfo } = lastPage.data.Page;
      return pageInfo.hasNextPage ? pageInfo.currentPage + 1 : undefined;
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Not logged in state
  if (!userId) {
    return (
      <ThemedView>
        <View className="flex-1 items-center justify-center p-6">
          <Octicons name="person" size={64} color={primaryOrange} />
          <Text className="text-2xl font-bold text-black dark:text-white mt-4 text-center">
            Not Logged In
          </Text>
          <Text className="text-black/70 dark:text-white/70 text-center mt-2 mb-6">
            Log in to see your liked anime and track your progress
          </Text>
          <Link href="/profile/login" asChild>
            <Pressable className="bg-primaryOrange px-6 py-3 rounded-full">
              <Text className="text-white font-medium">Log In</Text>
            </Pressable>
          </Link>
        </View>
      </ThemedView>
    );
  }

  // Loading state
  if (isPending) {
    return (
      <ThemedView>
        <View className="p-4">
          <Text className="text-3xl font-bold text-black dark:text-white mb-4">
            Liked
          </Text>
          <View className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" color={primaryOrange} />
            <Text className="text-black/70 dark:text-white/70 mt-4">
              Loading your anime list...
            </Text>
          </View>
        </View>
      </ThemedView>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <ThemedView>
        <View className="p-4">
          <Text className="text-3xl font-bold text-black dark:text-white mb-4">
            Liked
          </Text>
          <View className="flex-1 items-center justify-center py-12">
            <Octicons name="alert" size={48} color="#ef4444" />
            <Text className="text-xl font-semibold text-black dark:text-white mt-4">
              Something went wrong
            </Text>
            <Text className="text-black/70 dark:text-white/70 text-center mt-2 mb-6">
              We couldn't load your anime list. Please try again.
            </Text>
            <Pressable
              className="bg-primaryOrange px-6 py-3 rounded-full"
              onPress={onRefresh}
            >
              <Text className="text-white font-medium">Try Again</Text>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    );
  }

  // Organize data into sections
  const allMedia = data.pages.flatMap((page) => page.data.Page.mediaList);

  // Empty state
  if (allMedia.length === 0) {
    return (
      <ThemedView>
        <View className="p-4">
          <Text className="text-3xl font-bold text-black dark:text-white mb-4">
            Liked
          </Text>
          <EmptyState message="You haven't added any anime to your list yet" />
        </View>
      </ThemedView>
    );
  }

  // Group by status
  const sections = [
    {
      title: "Currently Watching",
      data: allMedia.filter((item) => item.status === "CURRENT"),
    },
    {
      title: "Completed",
      data: allMedia.filter((item) => item.status === "COMPLETED"),
    },
    {
      title: "Plan to Watch",
      data: allMedia.filter((item) => item.status === "PLANNING"),
    },
    {
      title: "On Hold",
      data: allMedia.filter((item) => item.status === "PAUSED"),
    },
    {
      title: "Dropped",
      data: allMedia.filter((item) => item.status === "DROPPED"),
    },
  ].filter((section) => section.data.length > 0);
  console.log(sections[0]);
  console.log(sections[0].data);

  return (
    <ThemedView>
      <View>
        <View className="p-4 pb-0">
          <Text className="text-3xl font-bold text-black dark:text-white mb-2">
            My Anime List
          </Text>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.media.id.toString()}
          renderItem={({ item }) => (
            <MediaHorizontal media={item.media} stepsBack={1} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<ListFooter loading={isFetchingNextPage} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[primaryOrange]}
              tintColor={primaryOrange}
            />
          }
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ThemedView>
  );
};

export default Liked;
