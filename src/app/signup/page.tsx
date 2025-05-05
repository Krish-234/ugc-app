import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export default function SignupPage() {
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
            {/* You can re-enable your logo here */}
            {/* <Icons.logo className="h-10 w-10" /> */}
            <h1 className="mt-3 text-2xl font-bold tracking-tight">AdCraft</h1>
          </div>

          {/* Auth Card */}
          <div className="w-full max-w-md rounded-xl border bg-white/80 p-8 shadow-lg backdrop-blur-sm sm:p-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Create an account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your details to get started
              </p>
            </div>

            <AuthForm type="signup" />

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>By signing up, you agree to our Terms of Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}
