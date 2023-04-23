"use client";

import LoginForm from "@/features/auth/components/LoginForm";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  let auth = useAuth();

  return auth ? (
    router.push("/home")
  ) : (
    <div className="pageContainer">
      <LoginForm />
    </div>
  );
}
