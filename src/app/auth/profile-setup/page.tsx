import { ProfileForm } from "@/components/forms/ProfileForm";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Complete Profile",
};

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/40 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-2xl text-center space-y-6">
        {/* Brand header */}
        <Link href="/" className="inline-flex items-center space-x-2 justify-center">
          <span className="h-9 w-9 bg-primary flex items-center justify-center rounded-xl text-primary-foreground shadow-md">
            <Shield className="h-5 w-5" />
          </span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            StarterKit
          </span>
        </Link>

        {/* Profile completion form */}
        <ProfileForm />
      </div>
    </div>
  );
}
