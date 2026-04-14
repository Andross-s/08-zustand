"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

import css from "./NotesPage.module.css";

import noteService from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { TAGS } from "@/types/note";

interface NotesClientProps {
  activeTag?: string;
}

function NotesClient({ activeTag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, activeTag],
    queryFn: () =>
      noteService.fetchNotes(
        page,
        search,
        activeTag && activeTag !== "all" ? (activeTag as TAGS) : undefined,
      ),
    staleTime: 500,
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Could not fetch the list of notes.</p>;

  const pageCount = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <Link href={"/notes/action/create"}>Create note +</Link>
        <SearchBox onChange={debouncedSetSearch} />
      </header>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm />
        </Modal>
      )}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading notes</div>}
      {Array.isArray(data?.notes) && data.notes.length > 0 && (
        <>
          {pageCount > 1 && (
            <Pagination
              totalPages={pageCount}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
          <NoteList notes={data?.notes ?? []} />
        </>
      )}
    </div>
  );
}

export default NotesClient;
