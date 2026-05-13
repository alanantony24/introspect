import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function OnboardingPage() {
  return (
    <SoftCard>
      <PageHeader
        eyebrow="Onboarding"
        title="Begin with context."
        description="This route will introduce the app boundaries, invite a few grounding preferences, and help the experience feel emotionally safe before any assessment starts."
      />
    </SoftCard>
  );
}
