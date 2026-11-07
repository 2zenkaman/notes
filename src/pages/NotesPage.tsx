import { useState } from "react"
import type { NoteFilters, Tag } from "../types"
import { Link } from "react-router"
import NoteCard from "../components/NoteCard"
import NoteFilterForm from "../components/NoteFilterForm"
import { useDeleteNote, useFetchNotes } from "../hooks/useApi"

export default function NotesPage() {
  const [tags, setTags] = useState<Tag[]>([])

  const [filters, setFilters] = useState<NoteFilters>({
    showHidden: () => {},
  })

  const handleFilterChange = (
    filter: string,
    fn: (params: URLSearchParams) => void,
  ) => {
    setFilters((prev) => ({ ...prev, [filter]: fn }))
  }

  const deleteNote = useDeleteNote()

  const { data: notes, isPending, error } = useFetchNotes(filters)

  // const handleToggleHidden = (noteId: string) => {
  //   fetch(`${API_URL}/notes/${noteId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify({
  //       hidden: !notes.find((note) => note.id === noteId)?.hidden,
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error("Failed to update note")
  //       }
  //     })
  //     .then(() => {
  //       setNotes((prevNotes) =>
  //         prevNotes.map((note) =>
  //           note.id === noteId ? { ...note, hidden: !note.hidden } : note,
  //         ),
  //       )
  //     })
  // }

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-500">
            Your space
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            My Notes
          </h1>
        </div>
        <Link
          to="/notes/create"
          className="inline-flex w-fit items-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
        >
          New note
        </Link>
      </div>
      <NoteFilterForm tags={tags} onFilterChange={handleFilterChange} />
      {/* {deleteError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {deleteError}
        </p> */}
      {/* )} */}
      {notes!.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes?.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => deleteNote.mutate(note.id)}
              onToggleHidden={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 px-6 py-14 text-center">
          <h2 className="text-base font-medium text-neutral-900">
            No notes yet
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Create a note to keep your thoughts in one place.
          </p>
        </div>
      )}
    </div>
  )
}
