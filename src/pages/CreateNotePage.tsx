import CreateNoteForm from "../components/CreateNoteForm"
import { useCreateNote } from "../hooks/useApi"

export default function CreateNotePage() {
  return (
    <section className="mx-auto max-w-2xl">
      <p className="mb-2 text-sm font-medium text-neutral-500">
        Add to your space
      </p>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight text-neutral-950">
        Create a note
      </h1>
      <CreateNoteForm onSubmit={useCreateNote().mutate} />
    </section>
  )
}
