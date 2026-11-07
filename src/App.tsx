import { createBrowserRouter, RouterProvider, Link } from "react-router"
import LoginPage from "./pages/LoginPage"
import NotesPage from "./pages/NotesPage"
import { AuthProvider } from "./hooks/useAuthContext"
import Layout from "./pages/Layout"
import RegisterPage from "./pages/RegisterPage"
import CreateNotePage from "./pages/CreateNotePage"
import EditNotePage from "./pages/EditNotePage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <main className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="max-w-xl text-center">
          <p className="mb-4 text-sm font-medium text-neutral-500">
            A quieter place to think
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-neutral-950 sm:text-6xl">
            Notes, simply.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-neutral-600">
            Capture what matters and come back to it whenever you need.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 hover:border-neutral-900"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>
    ),
  },
  {
    Component: Layout,
    children: [
      {
        path: "notes",
        children: [
          {
            path: "",
            Component: NotesPage,
          },
          {
            path: "create",
            Component: CreateNotePage,
          },
          {
            path: "edit",
            Component: EditNotePage,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
