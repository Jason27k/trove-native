import { useColorScheme } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { primaryOrange } from "@/constants/Colors";

const _layout = () => {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
        }}
      />
      <Stack.Screen
        name="top"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          headerTintColor: primaryOrange,
        }}
      />
      <Stack.Screen
        name="trending"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          headerTintColor: primaryOrange,
        }}
      />
      <Stack.Screen
        name="upcoming"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          headerTintColor: primaryOrange,
        }}
      />
      <Stack.Screen
        name="popular"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          headerTintColor: primaryOrange,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          headerTintColor: primaryOrange,
        }}
      />
    </Stack>
  );
};

export default _layout;
