import { MediaDisplay } from "@/api/model";
import { Link } from "expo-router";
import { Pressable, View, Image, Text } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { primaryOrange } from "@/constants/Colors";

const AnimeCardGrid = ({
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
      <Pressable className="flex-1 p-2 max-w-[50%]">
        <View className="relative">
          <Image
            className="w-full aspect-[2/3] rounded-lg"
            source={{ uri: media.coverImage.extraLarge }}
          />

          {media.averageScore && (
            <View className="absolute top-2 right-2 px-2 py-1 rounded-full dark:bg-black bg-white">
              <View className="flex-row items-center space-x-1">
                <Octicons name="star" size={12} color={primaryOrange} />
                <Text className="text-xs font-medium pl-1 dark:text-white text-black">
                  {media.averageScore / 10}
                </Text>
              </View>
            </View>
          )}

          <View className="pt-2">
            <Text className="text-lg font-semibold pt-2 text-left line-clamp-1 dark:text-white text-black">
              {media.title.english || media.title.romaji || media.title.native}
            </Text>
            <Text className="text-md text-left pb-2 line-clamp-2 dark:text-gray-400 text-gray-600">
              {media.description
                ? media.description.replace(/<[^>]*>/g, "")
                : ""}
            </Text>
          </View>
          <View
            className={`absolute top-2 left-2 px-2 py-1 rounded-full ${
              media.status === "RELEASING"
                ? "bg-green-500"
                : media.status === "NOT_YET_RELEASED"
                ? "bg-blue-500"
                : "bg-gray-500"
            }`}
          >
            <Text className="text-xs font-medium text-white">
              {media.status === "RELEASING"
                ? "Airing"
                : media.status === "NOT_YET_RELEASED"
                ? "Upcoming"
                : "Completed"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default AnimeCardGrid;
