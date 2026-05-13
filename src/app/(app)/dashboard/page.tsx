import { ActionCard } from "@/components/ui/ActionCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <SoftCard>
        <PageHeader
          eyebrow="Dashboard"
          title="Welcome back to a softer check-in."
          description="Your answers may suggest patterns over time. For now, this dashboard is a quiet placeholder for assessment progress, recent entries, and saved reflections."
        />
      </SoftCard>

      <div className="grid gap-4 sm:grid-cols-2">
        <ActionCard
          href="/assessment"
          title="Continue assessment"
          description="A short reflection flow will live here."
        />
        <ActionCard
          href="/journal"
          title="Open journal"
          description="A spacious writing surface will come next."
        />
      </div>
    </section>
  );
}
