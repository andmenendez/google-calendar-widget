'use client'

import { useEffect, useState } from "react"

export default function SignIn() {
  const [isInIframe, setIsInIframe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Detect if we're in an iframe
    setIsInIframe(window.self !== window.top)

    // Listen for storage changes from popup
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-success' && e.newValue === 'true') {
        // Clear the flag and reload
        localStorage.removeItem('auth-success')
        window.location.reload()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleSignIn = () => {
    setIsLoading(true)

    if (isInIframe) {
      // Open signin in popup with a unique identifier
      const popupId = `google-signin-${Date.now()}`
      const popup = window.open(
        `/auth/signin-popup?popup-id=${popupId}`,
        popupId,
        'width=500,height=600,left=200,top=200'
      )

      if (popup) {
        // Poll for popup completion
        const checkInterval = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(checkInterval)
              setIsLoading(false)
              // Check if auth was successful by looking for session cookie
              // Reload to refresh session
              setTimeout(() => {
                window.location.reload()
              }, 500)
            }
          } catch (e) {
            // Error accessing popup, likely closed
            clearInterval(checkInterval)
            setIsLoading(false)
          }
        }, 500)
      } else {
        setIsLoading(false)
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
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:bg-blue-400 transition font-medium"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
