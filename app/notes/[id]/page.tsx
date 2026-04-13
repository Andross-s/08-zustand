import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

import noteService from "@/lib/api";

import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await noteService.fetchNoteById(id);

  return {
    title: note.title,
    description: note.content,
  };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => noteService.fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
