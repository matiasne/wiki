import Image from "next/image";
import { Inter } from "next/font/google";
import TextEditor from "@/app/components/TextEditor/TextEditor";

const inter = Inter({ subsets: ["latin"] });

export default function TextEditorPage({ params }: { params: { id: string } }) {
  return <TextEditor id={params.id} />;
}
