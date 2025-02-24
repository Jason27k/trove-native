import ThemedView from "@/components/ThemedView";
import DataList from "@/components/DataList";

const upcoming = () => {
  return (
    <ThemedView>
      <DataList
        queryKey="trending"
        variables={{ sort: ["TRENDING_DESC"] }}
        title="Featured Anime"
        stepsBack={2}
      />
    </ThemedView>
  );
};

export default upcoming;
