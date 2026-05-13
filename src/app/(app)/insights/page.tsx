import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function InsightsPage() {
  return (
    <SoftCard>
      <PageHeader
        eyebrow="Insights"
        title="Saved reflections over time."
        description="This route will collect gentle observations, recurring themes, and small next steps without treating any one insight as final."
      />
    </SoftCard>
  );
}
