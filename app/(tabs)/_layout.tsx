import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { primaryOrange, mainGray, tabGray } from "@/constants/Colors";
import { useColorScheme, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: primaryOrange,
          tabBarInactiveTintColor: colorScheme === "dark" ? mainGray : "#000",
          tabBarStyle: {
            backgroundColor: colorScheme === "dark" ? tabGray : mainGray,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="magnifying-glass" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Liked"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="heart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Calendar"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <AntDesign name="calendar" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user-circle" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
