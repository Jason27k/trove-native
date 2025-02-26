import ThemedView from "@/components/ThemedView";
import DataList from "@/components/DataList";

const upcoming = () => {
  return (
    <ThemedView>
      <DataList
        queryKey="popular"
        variables={{ sort: ["POPULARITY_DESC"] }}
        title="Featured Anime"
        stepsBack={2}
      />
    </ThemedView>
  );
};

export default upcoming;
