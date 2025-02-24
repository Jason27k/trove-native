import { View, Text, useColorScheme, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAniListAnime } from "@/api/api";
import {
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  SafeAreaView,
  FlatList,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { primaryOrange } from "@/constants/Colors";
import {
  CharacterEdge,
  RecommendationNode,
  RelationEdge,
  StaffEdge,
} from "@/api/model";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Badge = ({
  icon,
  text,
  color,
}: {
  icon: string;
  text: string | number;
  color: string;
}) => (
  <View className="flex-row items-center px-2 py-1 rounded dark:bg-white/10 bg-black/10">
    <MaterialIcons name={icon as any} size={18} color={primaryOrange} />
    <Text className="text-lg ml-1 dark:text-white text-black">{text}</Text>
  </View>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View className="flex-row justify-between py-2 border-b dark:border-white/10 border-black/10">
    <Text className="dark:text-gray-400 text-gray-800 text-md">{label}</Text>
    <Text className="text-md dark:text-white text-black">{value}</Text>
  </View>
);

const CharacterCard = ({ character }: { character: CharacterEdge }) => (
  <View style={{ width: SCREEN_WIDTH * 0.21 }} className="mr-3">
    <Image
      source={{ uri: character.node.image.large }}
      style={{ width: SCREEN_WIDTH * 0.21, height: SCREEN_HEIGHT * 0.16 }}
      className="rounded-lg"
    />
    <Text className="dark:text-white text-black text-md font-medium mt-2 line-clamp-1">
      {character.node.name.userPreferred}
    </Text>
    <Text className="dark:text-gray-400 text-gray-800 text-sm">
      {character.role}
    </Text>
  </View>
);

const StaffCard = ({ staff }: { staff: StaffEdge }) => (
  <View style={{ width: SCREEN_WIDTH * 0.21 }} className="mr-3">
    <Image
      source={{ uri: staff.node.image.large }}
      style={{ width: SCREEN_WIDTH * 0.21, height: SCREEN_HEIGHT * 0.16 }}
      className="rounded-lg"
    />
    <Text className="dark:text-white text-black text-md font-medium mt-2 line-clamp-1">
      {staff.node.name.userPreferred}
    </Text>
    <Text className="dark:text-gray-400 text-gray-800 text-sm">
      {staff.role}
    </Text>
  </View>
);

const RelationCard = ({ relation }: { relation: RelationEdge }) => (
  <View style={{ width: SCREEN_WIDTH * 0.21 }} className="mr-3">
    <Image
      source={{ uri: relation.node.coverImage.large }}
      style={{ width: SCREEN_WIDTH * 0.21, height: SCREEN_HEIGHT * 0.16 }}
      className="rounded-lg"
    />
    <Text className="dark:text-white text-black text-md font-medium mt-2 line-clamp-1">
      {relation.node.title.english || relation.node.title.romaji}
    </Text>
    <Text className="dark:text-gray-400 text-gray-800 text-sm">
      {relation.relationType}
    </Text>
  </View>
);

const RecommendationCard = ({
  recommendation,
}: {
  recommendation: RecommendationNode;
}) => {
  const router = useRouter();

  const goToNextAnime = (id: string) => {
    router.push(`./${id}`);
  };

  return (
    <Pressable
      style={{ width: SCREEN_WIDTH * 0.21 }}
      className="mr-3"
      onPress={() =>
        goToNextAnime(recommendation.mediaRecommendation.id.toString())
      }
    >
      <Image
        source={{ uri: recommendation.mediaRecommendation.coverImage.large }}
        style={{ width: SCREEN_WIDTH * 0.21, height: SCREEN_HEIGHT * 0.16 }}
        className="rounded-lg"
      />
      <Text className="dark:text-white text-black text-md font-medium mt-2 line-clamp-1">
        {recommendation.mediaRecommendation.title.english ||
          recommendation.mediaRecommendation.title.romaji}
      </Text>
      <Text className="dark:text-gray-400 text-gray-800 text-sm">
        {recommendation.mediaRecommendation.format}
      </Text>
    </Pressable>
  );
};

const AnimeDetails = () => {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "white" : "black";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const {
    data: media,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["anime", id],
    queryFn: () => {
      return fetchAniListAnime(Number(id));
    },
  });

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error</Text>;
  }

  return (
    <SafeAreaView className="dark:bg-black bg-white">
      <ScrollView className="">
        {/* Hero Section */}
        <View className="relative" style={{ height: SCREEN_HEIGHT * 0.35 }}>
          <View className="absolute bottom-0 left-0 right-0 p-4 flex-row gap-4">
            <Image
              source={{ uri: media.coverImage.large }}
              style={{
                resizeMode: "contain",
                width: SCREEN_WIDTH * 0.45,
                height: SCREEN_HEIGHT * 0.35,
              }}
              className="rounded-lg"
            />
            <View className="flex-1 justify-center">
              <Text className="text-3xl font-bold dark:text-white text-black">
                {media.title.english ||
                  media.title.romaji ||
                  media.title.native}
              </Text>

              <View className="flex-row flex-wrap gap-2 mt-2">
                {media.averageScore && (
                  <Badge
                    icon="star"
                    text={media.averageScore / 10}
                    color={color}
                  />
                )}
                <Badge
                  icon="people"
                  text={media.popularity.toLocaleString()}
                  color={color}
                />
                <Badge
                  icon="favorite"
                  text={media.favourites.toLocaleString()}
                  color={color}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Overview Section */}
        <View className="px-4 space-y-4 pb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {media.genres.map((genre) => (
                <View
                  key={genre}
                  className="dark:bg-white/10 bg-black/10 px-3 py-1.5 rounded-full"
                >
                  <Text className="dark:text-white text-black text-lg">
                    {genre}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {media.description && (
            <View className="mt-2">
              <Text
                className="dark:text-gray-300 text-gray-600 text-lg leading-5"
                numberOfLines={isDescriptionExpanded ? undefined : 3}
              >
                {media.description.replace(/<[^>]*>/g, "")}
              </Text>
              <TouchableOpacity
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2"
              >
                <Text className="dark:text-white text-black text-lg text-center">
                  {isDescriptionExpanded ? "Show Less" : "Show More"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="space-y-2">
            <InfoRow label="Format" value={media.format} />
            <InfoRow label="Episodes" value={media.episodes || "?"} />
            <InfoRow
              label="Duration"
              value={media.duration ? `${media.duration} mins` : "?"}
            />
            <InfoRow label="Status" value={media.status} />
          </View>

          {media.studios.edges.length > 0 && (
            <View className="mt-2">
              <Text className="dark:text-gray-400 text-gray-800 text-md">
                Studios
              </Text>
              <Text className="dark:text-white text-black text-md mt-1">
                {media.studios.edges.map((edge) => edge.node.name).join(", ")}
              </Text>
            </View>
          )}
        </View>

        {/* Characters Section */}
        {media.characterPreview && media.characterPreview.edges.length > 0 && (
          <View className="p-4">
            <Text className="text-xl font-bold dark:text-white text-black mb-4">
              Characters
            </Text>
            <FlatList
              data={media.characterPreview.edges}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <CharacterCard character={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}

        {/* Relations Section */}
        {media.relations.edges.length > 0 && (
          <View className="p-4">
            <Text className="text-xl font-bold dark:text-white text-black mb-4">
              Relations
            </Text>
            <FlatList
              data={media.relations.edges}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <RelationCard relation={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}

        {/* Recommendation Section */}
        {media.relations.edges.length > 0 && (
          <View className="p-4">
            <Text className="text-xl font-bold dark:text-white text-black mb-4">
              Recommended
            </Text>
            <FlatList
              data={media.recommendations.nodes}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <RecommendationCard recommendation={item} />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}

        {/* Staff Section */}
        {media.staffPreview && media.staffPreview.edges.length > 0 && (
          <View className="p-4">
            <Text className="text-xl font-bold dark:text-white text-black mb-4">
              Staff
            </Text>
            <FlatList
              data={media.staffPreview.edges}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <StaffCard staff={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        )}

        {/* Streaming Links */}
        {media.streamingEpisodes?.length > 0 && (
          <View className="p-4">
            <Text className="text-xl font-bold dark:text-white text-black mb-4">
              Watch
            </Text>
            {media.streamingEpisodes.map((episode) => (
              <TouchableOpacity
                key={episode.url}
                className="flex-row items-center dark:bg-white/5 bg-black/5 p-3 rounded-lg mb-2"
                onPress={() => Linking.openURL(episode.url)}
              >
                <Image
                  source={{ uri: episode.thumbnail }}
                  style={{
                    width: SCREEN_WIDTH * 0.18,
                    height: SCREEN_HEIGHT * 0.08,
                  }}
                  className="rounded"
                />
                <View className="flex-1 ml-3">
                  <Text className="dark:text-white text-black text-md font-medium line-clamp-2">
                    {episode.title}
                  </Text>
                  <Text className="dark:text-gray-400 text-gray-800 text-sm mt-1">
                    {episode.site}
                  </Text>
                </View>
                <Feather
                  name="play-circle"
                  size={24}
                  style={{ color: primaryOrange }}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* External Links */}
        {media.externalLinks?.length > 0 && (
          <View className="p-4">
            <Text className="text-xl font-bold dark:text-white text-black mb-4">
              External Links
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {media.externalLinks.map((link) => (
                <TouchableOpacity
                  key={link.id}
                  className="flex-row items-center dark:bg-white/5 bg-black/5 p-3 rounded-lg flex-1 min-w-[48%]"
                  onPress={() => Linking.openURL(link.url)}
                >
                  {link.icon && (
                    <Image
                      source={{ uri: link.icon }}
                      className="w-4 h-4 mr-2 bg-black dark:bg-none"
                    />
                  )}
                  <Text className="dark:text-white text-black text-sm">
                    {link.site}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnimeDetails;
