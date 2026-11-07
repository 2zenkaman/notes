import { createContext, useContext, useEffect, useState } from "react"
import {
  AuthenticationError,
  NetworkError,
  type UserLoginData,
  type User,
  type UserRegisterData,
} from "../types"
import { API_URL } from "../utils"

export type AuthContextType = {
  user: User | null
  reg: (user: UserRegisterData) => void
  login: (user: UserLoginData) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  reg: () => {},
  login: () => {},
  logout: () => {},
  isLoading: false,
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetch(`${API_URL}/user`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          setUser(null)
          return
        }

        return res.json()
      })
      .then((user: User) => {
        setUser(user)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleLogin = (data: UserLoginData) => {
    setIsLoading(true)

    const params = new URLSearchParams()
    params.set("email", data.email)
    params.set("password", data.password)

    fetch(`${API_URL}/login?${params.toString()}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new AuthenticationError("Incorrect password")
        }

        return res.json()
      })
      .then((data: User) => {
        setUser(data)
      })
      .catch(() => {
        throw new NetworkError("")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleLogout = () => {
    setIsLoading(true)

    fetch(`${API_URL}/logout`, {
      credentials: "include",
    })
      .then((res) => {
        setUser(null)
      })
      .catch(() => {
        throw new NetworkError("")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleRegister = (data: UserRegisterData) => {
    setIsLoading(true)

    fetch(`${API_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new AuthenticationError("User already exists.")
        }

        return res.json()
      })
      .then((data: User) => {
        setUser(data)
      })
      .catch(() => {
        throw new NetworkError("Check your internet connection.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        reg: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
