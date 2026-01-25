'use client'

import { useEffect } from "react"
import { signInWithGoogle } from "@/app/auth/actions"

export default function SignInPopup() {
  useEffect(() => {
    // Check if we just completed OAuth and came back from callback
    const params = new URLSearchParams(window.location.search)
    if (params.has('auth-complete')) {
      // Small delay to ensure session is set, then close popup
      setTimeout(() => {
        window.close()
      }, 500)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Google Calendar Widget
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to view your private calendars
          </p>
        </div>

        <form
          action={() => signInWithGoogle("/auth/signin-popup?auth-complete=true")}
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition font-medium"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  )
}
