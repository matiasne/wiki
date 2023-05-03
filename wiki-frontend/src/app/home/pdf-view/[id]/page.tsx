"use client";
import PDFViewer from "@/features/files/pdf-viewer/PDFViewer";
import { useSearchParams } from "next/navigation";

export default function PDFViewPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  return <PDFViewer pdfUrl={""} />;
}
