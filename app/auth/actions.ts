'use server'

import { signIn } from '@/lib/auth'

export async function signInWithGoogle(redirectUrl: string) {
  await signIn('google', { redirectTo: redirectUrl })
}
