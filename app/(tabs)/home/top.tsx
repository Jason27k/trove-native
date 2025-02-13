import ThemedView from "@/components/ThemedView";
import DataList from "@/components/DataList";

const top = () => {
  return (
    <ThemedView>
      <DataList queryKey="top" variables={{ sort: ["SCORE_DESC"] }} />
    </ThemedView>
  );
};

export default top;
