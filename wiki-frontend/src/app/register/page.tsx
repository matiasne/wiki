"use client";

import RegisterForm from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  let auth = useAuth();

  return auth ? (
    router.push("/home")
  ) : (
    <div className="pageContainer">
      <RegisterForm />
    </div>
  );
}
