import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function AssessmentPage() {
  return (
    <SoftCard>
      <PageHeader
        eyebrow="Assessment"
        title="A short self-reflection flow."
        description="Questions, progress, and a gentle reflection profile will be shaped here. The language should stay curious and non-absolute."
      />
    </SoftCard>
  );
}
