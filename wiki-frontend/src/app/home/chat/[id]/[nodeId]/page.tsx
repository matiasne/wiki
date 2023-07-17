"use client";
import ChatInterface from "@/features/chat/ChatInterface";
import { useSearchParams } from "next/navigation";

export default function ChatPage({
  params,
}: {
  params: { id: string; nodeId: string };
}) {
  return <ChatInterface nodeId={params.nodeId} chatterboxId={params.id} />;
}
