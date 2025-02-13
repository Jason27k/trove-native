import { SafeAreaView, useColorScheme, View } from "react-native";

const ThemedView = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: colorScheme === "dark" ? "black" : "white",
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: colorScheme === "dark" ? "black" : "white",
        }}
        className="p-4"
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default ThemedView;
