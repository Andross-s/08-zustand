"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import noteService from "@/lib/api";
import type { TAGS } from "@/types/note";

import css from "./NoteForm.module.css";

function NoteForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as TAGS;

    await noteService.createNote({ title, content, tag: tag as TAGS });
    setIsPending(false);
    router.push("/notes/filter/all");
  }

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" className={css.input} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" name="tag" className={css.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
