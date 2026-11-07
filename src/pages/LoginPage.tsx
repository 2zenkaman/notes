import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { useAuthContext } from "../hooks/useAuthContext"
import { AuthenticationError } from "../types"

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const { login, isLoading } = useAuthContext()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<LoginFormValues>({
    mode: "onChange",
  })

  const handleLogin = (data: LoginFormValues) => {
    try {
      login(data)
    } catch (e) {
      if (e instanceof AuthenticationError) {
        setError("password", {
          type: "server",
          message: e.message,
        })
      } else {
        setError("root.server", {
          type: "server",
          message: "Couldn't reach the server. Please try again",
        })
      }
    }
    navigate("/notes")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm shadow-neutral-950/[0.04] sm:p-10">
        <p className="mb-2 text-sm font-medium text-neutral-500">
          Welcome back
        </p>
        <h1 className="mb-7 text-3xl font-semibold tracking-tight text-neutral-950">
          Sign in
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              {...register("email", {
                required: true,
              })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              {...register("password", {
                required: true,
              })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-2">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500">
          New here?{" "}
          <Link
            to="/register"
            className="font-medium text-neutral-950 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
