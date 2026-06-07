import { AuthForm } from "@/components/auth/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-10 text-stone-800 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col items-center justify-center gap-6">
        <div className="text-center">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-stone-400">
            Introspect
          </p>
          <p className="mt-1 font-serif text-lg italic text-[#473623]">
            a quiet place to know yourself
          </p>
        </div>
        <SoftCard className="w-full p-7 sm:p-8">
          <PageHeader
            eyebrow="Create account"
            title="Start a Supabase-backed account"
            description="This prepares the foundation for future syncing while keeping today's local reflection tools unchanged."
          />
          <AuthForm mode="signup" />
        </SoftCard>
      </div>
    </main>
  );
}
