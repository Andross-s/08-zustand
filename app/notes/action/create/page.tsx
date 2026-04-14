import NoteForm from "@/components/NoteForm/NoteForm";

import css from "./CreateNote.module.css";

async function createNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        {/* NoteForm component */}
        <NoteForm />
      </div>
    </main>
  );
}

export default createNote;
