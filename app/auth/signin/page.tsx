'use client'

import { useEffect, useState } from "react"

export default function SignIn() {
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    // Detect if we're in an iframe
    setIsInIframe(window.self !== window.top)
  }, [])

  const handleSignIn = () => {
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
      // Redirect to signin-direct for normal flow
      window.location.href = '/auth/signin-direct'
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
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 transition font-medium"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
