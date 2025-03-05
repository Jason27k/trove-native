import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "",
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
