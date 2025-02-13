import ThemedView from "@/components/ThemedView";
import DataList from "@/components/DataList";

const upcoming = () => {
  return (
    <ThemedView>
      <DataList queryKey="trending" variables={{ sort: ["TRENDING_DESC"] }} />
    </ThemedView>
  );
};

export default upcoming;
