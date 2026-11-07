import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createNote, deleteNote, fetchNote, fetchNotes } from "../api"
import { NoteCreateDTO, NoteDTO, NoteFilters } from "../types"
import { toNote } from "../utils"

export const useFetchNotes = (filters: NoteFilters) =>
  useQuery({
    queryKey: ["notes", filters],
    queryFn: ({ signal }) => fetchNotes({ signal, filters }),
    select: (data) => data.map(toNote),
  })

export const useFetchNote = (id: string) =>
  useQuery({
    queryKey: ["notes", id],
    queryFn: ({ signal }) => fetchNote({ id, signal }),
    select: toNote,
  })

export const useDeleteNote = () => {
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async (data: any) => {
      await useQueryClient().invalidateQueries({ queryKey: ["notes", data.id] })
    },
  })
}

export const useCreateNote = () => {
  return useMutation({
    mutationFn: (data: NoteCreateDTO) => createNote(data),
    onSuccess: async (data: NoteDTO) => {
      await useQueryClient().invalidateQueries({ queryKey: ["notes", data.id] })
    },
  })
}
