"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import TextEditor from "@/app/components/TextEditor/TextEditor";
import { useSearchParams } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function TextEditorPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  console.log(searchParams.get("username")); // Logs "search"

  return (
    <TextEditor
      id={params.id}
      username={searchParams.get("username") || "Default"}
    />
  );
}
