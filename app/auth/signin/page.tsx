'use client'

import { signIn } from "@/lib/auth"
import { useEffect, useState } from "react"

export default function SignIn() {
  const [isInIframe, setIsInIframe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Detect if we're in an iframe
    setIsInIframe(window.self !== window.top)

    // If this page was opened in a popup and auth succeeded, notify parent
    if (window.opener && window.location.search.includes('callbackComplete=true')) {
      window.opener.postMessage({ type: 'signin-success' }, '*')
      window.close()
    }
  }, [])

  const handleSignIn = async () => {
    setIsLoading(true)

    if (isInIframe) {
      // Open signin in popup
      const popup = window.open(
        '/auth/signin-popup',
        'google-signin',
        'width=500,height=600,left=200,top=200'
      )

      if (popup) {
        // Listen for success message from popup
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'signin-success') {
            // Reload to get new session
            window.location.reload()
            window.removeEventListener('message', handleMessage)
          }
        }
        window.addEventListener('message', handleMessage)
      }
    } else {
      // Normal redirect for non-iframe
      await signIn("google", { redirectTo: "/" })
    }
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
