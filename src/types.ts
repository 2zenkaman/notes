export interface Tag {
  id: string
  name: string
}

export interface NoteCreateDTO {
  title: string
  content: string
  hidden: boolean
  tags: string[]
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  hidden: boolean
  tags: Tag[]
}

export interface NoteDTO {
  id: string
  title: string
  content: string
  createdAt: string
  hidden: boolean
  tags: Tag[]
}

export type NoteFilters = Record<string, (params: URLSearchParams) => void>

export type User = {
  id: string
  login: string
}

export type UserLoginData = {
  email: string
  password: string
}

export type UserRegisterData = {
  login: string
  email: string
  password: string
}

export type NoteContextType = {
  note: Note | null
  setNote: (note: Note | null) => void
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthenticationError"
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NetworkError"
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}
