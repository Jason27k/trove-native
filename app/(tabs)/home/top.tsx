import ThemedView from "@/components/ThemedView";
import DataList from "@/components/DataList";

const top = () => {
  return (
    <ThemedView>
      <DataList
        queryKey="top"
        variables={{ sort: ["SCORE_DESC"] }}
        title="All Time Ranked"
        stepsBack={2}
      />
    </ThemedView>
  );
};

export default top;
