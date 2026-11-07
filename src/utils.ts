import type { Note, NoteDTO } from "./types"

export const API_URL = "http://localhost:8080"

export function toNote(noteDTO: NoteDTO): Note {
  return {
    id: noteDTO.id,
    title: noteDTO.title,
    content: noteDTO.content,
    createdAt: new Date(noteDTO.createdAt),
    hidden: noteDTO.hidden,
    tags: noteDTO.tags,
  } as Note
}
