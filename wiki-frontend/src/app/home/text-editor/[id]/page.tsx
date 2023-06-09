"use client";
import { useSearchParams } from "next/navigation";
import TextEditor from "@/features/text-editor/components/TextEditor";

export default function TextEditorPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  return (
    <TextEditor
      id={params.id}
      username={searchParams.get("username") || "Default"}
    />
  );
}
