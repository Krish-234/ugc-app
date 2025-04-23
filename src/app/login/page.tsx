import { AuthForm } from "@/components/Auth/AuthForm";
import Link from "next/link";
// import { Icons } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50/20 via-white to-purple-50/20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-0 h-[200px] w-[200px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[200px] w-[200px] rounded-full bg-purple-100/50 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto flex w-full flex-col items-center justify-center px-4 py-12 sm:px-0">
          {/* Logo/Header */}
          <div className="mb-8 flex flex-col items-center">
            {/* <Icons.logo className="h-10 w-10" /> */}
            <h1 className="mt-3 text-2xl font-bold tracking-tight">AdCraft</h1>
          </div>

          {/* Auth Card */}
          <div className="w-full max-w-md rounded-xl border bg-white/80 p-8 shadow-lg backdrop-blur-sm sm:p-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your account to continue creating ads
              </p>
            </div>

            <AuthForm type="login" />

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="h-px w-full bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <span className="h-px w-full bg-gray-200" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                {/* <Icons.google className="h-4 w-4" /> */}
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                {/* <Icons.github className="h-4 w-4" /> */}
                GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>By continuing, you agree to our Terms of Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}