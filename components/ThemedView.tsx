import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  StyleSheet,
} from "react-native";

const ThemedView = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      style={{
        backgroundColor: colorScheme === "dark" ? "black" : "white",
        flex: 1,
      }}
      className="relative"
    >
      <StatusBar
        animated={true}
        backgroundColor={colorScheme === "dark" ? "black" : "white"}
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ECF0F1",
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: "center",
    marginBottom: 8,
  },
});

export default ThemedView;
