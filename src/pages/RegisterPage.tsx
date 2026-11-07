import { useForm } from "react-hook-form"
import { API_URL } from "../utils"
import { Link, useNavigate } from "react-router"
import { useAuthContext } from "../hooks/useAuthContext"
import { userInfo } from "os"
import { NetworkError } from "../types"

type RegisterFormValues = {
  email: string
  login: string
  password: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { reg } = useAuthContext()

  const {
    register,
    handleSubmit,
    setError,
    formState: { isValid, errors },
  } = useForm<RegisterFormValues>({
    mode: "onChange",
  })

  const handleRegister = (data: RegisterFormValues) => {
    try {
      reg(data)
    } catch (e) {
      if (e instanceof NetworkError) {
        setError("root.server", {
          type: "server",
          message: "Unreachable network",
        })
      }
    }
    navigate("/notes")
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm shadow-neutral-950/[0.04] sm:p-10">
        <p className="mb-2 text-sm font-medium text-neutral-500">Get started</p>
        <h1 className="mb-7 text-3xl font-semibold tracking-tight text-neutral-950">
          Create your account
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(handleRegister)}>
          <input
            type="text"
            placeholder="Login"
            aria-label="Login"
            {...register("login", { required: true })}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            {...register("email", { required: true })}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            {...register("password", { required: true })}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:bg-white focus:outline-none"
          />
          {errors.form && (
            <p className="text-sm text-red-600">{errors.form.message}</p>
          )}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Create account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-neutral-950 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
