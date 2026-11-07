import axios from "axios"
import { NoteCreateDTO, NoteDTO, NoteFilters } from "./types"

const API_URL = "http://localhost:8080"

export const fetchNotes = async ({
  signal,
  filters,
}: {
  signal: AbortSignal
  filters: NoteFilters
}) => {
  const params = new URLSearchParams()
  Object.values(filters).forEach((fn) => fn(params))
  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axios.get<NoteDTO[]>(`${API_URL}/notes${query}`, {
    signal,
    withCredentials: true,
  })
  return response.data
}

export const fetchNote = async ({
  id,
  signal,
}: {
  id: string
  signal: AbortSignal
}) => {
  const response = await axios.get<NoteDTO>(`${API_URL}/notes/${id}`, {
    signal,
    withCredentials: true,
  })
  return response.data
}

export const deleteNote = async (id: string) => {
  const response = await axios.delete(`${API_URL}/notes/${id}`, {
    withCredentials: true,
  })
  return response.data
}

export const createNote = async (data: NoteCreateDTO) => {
  const response = await axios.post(`${API_URL}/notes`, data, {
    withCredentials: true,
  })
  return response.data
}

export const checkAuth = async () => {
  const response = await axios.get(`${API_URL}/user`, {
    withCredentials: true,
  })
  return response.data
}
