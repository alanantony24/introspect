import { AuthForm } from "@/components/auth/AuthForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-10 text-stone-800 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <SoftCard className="w-full p-7 sm:p-8">
          <PageHeader
            eyebrow="Welcome back"
            title="Sign in to Introspect"
            description="Use your account when you are ready to sync reflections later. The current app remains available without signing in."
          />
          <AuthForm mode="login" />
        </SoftCard>
      </div>
    </main>
  );
}
