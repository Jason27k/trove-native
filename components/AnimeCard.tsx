import { MediaDisplay } from "@/api/model";
import { Link } from "expo-router";
import { Pressable, View, Image, Text } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { primaryOrange } from "@/constants/Colors";

const AnimeCard = ({
  item,
  featured = false,
}: {
  item: MediaDisplay;
  featured?: boolean;
}) => {
  return (
    <Link href={`./${item.id}`} asChild relativeToDirectory>
      <Pressable className={`${featured ? "w-[85vw]" : "w-[42vw]"} pr-4`}>
        <View className="relative">
          <Image
            className={`w-full ${
              featured ? "aspect-[16/9]" : "aspect-[2/3]"
            } rounded-xl object-center`}
            source={{
              uri: featured
                ? item.bannerImage || item.coverImage.extraLarge
                : item.coverImage.extraLarge,
            }}
          />

          {item.averageScore && (
            <View className="absolute top-2 right-2 px-2 py-1 rounded-full dark:bg-black bg-white">
              <View className="flex-row items-center space-x-1">
                <Octicons name="star" size={12} color={primaryOrange} />
                <Text className="text-xs font-medium pl-1 dark:text-white text-black">
                  {item.averageScore / 10}
                </Text>
              </View>
            </View>
          )}

          <View className="pt-2">
            <Text className="text-base font-semibold dark:text-white text-black">
              {item.title.english || item.title.native}
            </Text>
            <Text className="text-sm dark:text-gray-400 text-gray-600 line-clamp-2">
              {item.description.replace(/<[^>]*>/g, "")}
            </Text>
          </View>
          <View
            className={`absolute top-2 left-2 px-2 py-1 rounded-full ${
              item.status === "RELEASING"
                ? "bg-green-500"
                : item.status === "NOT_YET_RELEASED"
                ? "bg-blue-500"
                : "bg-gray-500"
            }`}
          >
            <Text className="text-xs font-medium text-white">
              {item.status === "RELEASING"
                ? "Airing"
                : item.status === "NOT_YET_RELEASED"
                ? "Upcoming"
                : "Completed"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default AnimeCard;
