import { Link, Navigate, Outlet } from "react-router"
import { useAuthContext } from "../hooks/useAuthContext"

export default function Layout() {
  const { user, logout, isLoading } = useAuthContext()

  if (isLoading) {
    return <div>Loading your page</div>
  }

  if (!user) {
    return <Navigate to={"/login"} />
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8 sm:py-8">
      <header className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-5">
        <div>
          <Link
            to="/notes"
            className="text-lg font-semibold tracking-tight text-neutral-950"
          >
            Notes
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="mb-1 flex items-end gap-2">
            <p className="text-sm font-medium text-neutral-500">Signed in as</p>
            <p className="text-sm font-medium text-neutral-950">{user.login}</p>
          </div>
          <button
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-950"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
