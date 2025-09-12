// src/app/login/page.tsx

import { LoginForm } from "@/components/auth/LoginForm";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sign In | Naratia - Collaborative Storytelling Platform",
  description:
    "Sign in to your Naratia account and continue your storytelling journey. Access your stories, contributions, voting history, and connect with the collaborative writing community.",
  keywords: [
    "naratia login",
    "sign in",
    "storytelling login",
    "collaborative writing login",
    "naratia account",
    "writer login",
  ],
  openGraph: {
    title: "Sign In | Naratia",
    description:
      "Sign in to your Naratia account and continue your storytelling journey.",
    type: "website",
    url: "/login",
    siteName: "Naratia",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Sign In | Naratia",
    description:
      "Sign in to your Naratia account and continue your storytelling journey.",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    </AuthGuard>
  );
}
