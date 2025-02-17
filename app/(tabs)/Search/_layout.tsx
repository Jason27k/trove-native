import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { primaryOrange } from "@/constants/Colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          headerRight: () => {
            return (
              <View className="flex flex-row justify-end pb-4">
                <Link href="/Search/results">
                  <FontAwesome6
                    name="magnifying-glass"
                    size={24}
                    color={primaryOrange}
                  />
                </Link>
              </View>
            );
          },
          headerLeft: () => {
            return (
              <Text
                className="text-3xl font-semibold pl-1"
                style={{ color: colorScheme === "dark" ? "#fff" : "#000" }}
              >
                Search For Anime
              </Text>
            );
          },
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
        }}
      />
    </Stack>
  );
}
