import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function JournalPage() {
  return (
    <SoftCard>
      <PageHeader
        eyebrow="Journal"
        title="A place to write without hurry."
        description="Journal entries and reflective feedback will live here later. For now, this placeholder keeps the route ready for the core writing workflow."
      />
    </SoftCard>
  );
}
