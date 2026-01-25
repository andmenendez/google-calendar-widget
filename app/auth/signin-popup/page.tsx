'use client'

import { signIn } from "@/lib/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPopup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if we just completed OAuth and came back from callback
    const params = new URLSearchParams(window.location.search)
    if (params.has('auth-complete')) {
      // Notify parent window that signin was successful
      if (window.opener) {
        window.opener.postMessage({ type: 'signin-success' }, '*')
      }
      // Close popup after a brief delay to allow message to be received
      setTimeout(() => window.close(), 100)
    }
  }, [])

  const handleSignIn = async () => {
    setIsLoading(true)
    // Redirect to auth complete page after signin
    await signIn("google", { redirectTo: "/auth/signin-popup?auth-complete=true" })
  }

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

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:bg-blue-400 transition font-medium"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
