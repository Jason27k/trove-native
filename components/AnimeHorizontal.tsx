import { Pressable, Text, View, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Octicons from "@expo/vector-icons/Octicons";
import { MediaDisplay } from "@/api/model";
import { primaryOrange } from "@/constants/Colors";

export const AnimeHorizontal = ({
  media,
  stepsBack,
}: {
  media: MediaDisplay;
  stepsBack: number;
}) => {
  return (
    <Link
      href={`${".".repeat(stepsBack)}/${media.id}`}
      asChild
      relativeToDirectory
    >
      <Pressable className="flex flex-row items-center border-b-[1px] border-black/10 dark:border-white/10 bg-mainGray dark:bg-tabGray">
        <View className="relative pl-3 py-3">
          <Image
            width={80}
            height={120}
            source={{ uri: media.coverImage.extraLarge }}
            className="rounded-md"
          />
          {media.averageScore && media.averageScore > 0 && (
            <View className="absolute top-4 right-1 bg-black/50 dark:bg-black/70 rounded px-1 py-0.5">
              <Text className="text-white text-xs font-medium">
                {(media.averageScore / 10).toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        <View className="pl-3 pb-2 flex-1">
          <Text className="text-lg font-semibold line-clamp-1 max-w-72 pb-1 dark:text-white text-black">
            {media.title.english || media.title.romaji || media.title.native}
          </Text>

          <Text className="text-md max-w-72 line-clamp-1 dark:text-[#aaa] text-[#4b5563]">
            {media.genres.join(", ")}
          </Text>
        </View>

        <View className="ml-auto pr-5">
          <Octicons name="chevron-right" size={24} color={primaryOrange} />
        </View>
      </Pressable>
    </Link>
  );
};

export default AnimeHorizontal;
