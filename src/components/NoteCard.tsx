import type { Note } from "../types"
import TagComponent from "./TagComponent"

interface Props {
  note: Note
  onDelete: () => void
  onToggleHidden: () => void
}

export default function NoteCard({ note, onDelete, onToggleHidden }: Props) {
  return (
    <div className="border p-2 rounded-md">
      <div className="flex gap-2">
        <h2 className="text-lg font-bold">{note.title}</h2>
        {note.tags.map((t) => {
          return <TagComponent tag={t} key={t.id} selected={false} />
        })}
      </div>
      <div className="flex gap-2">
        <p>{note.createdAt.toLocaleDateString()}</p>
      </div>
      <p>{note.content}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  )
}
