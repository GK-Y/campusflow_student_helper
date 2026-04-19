import { useEffect, useMemo, useState } from 'react'
import { authService, isSupabaseConfigured } from '../services/storageAdapter'
import { AuthContext } from './auth-context'

function normalizeUser(sessionUser) {
  if (!sessionUser) {
    return null
  }

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name:
      sessionUser.user_metadata?.full_name ||
      sessionUser.user_metadata?.name ||
      sessionUser.name ||
      sessionUser.email?.split('@')[0] ||
      'Student',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let active = true

    authService
      .getSession()
      .then((sessionUser) => {
        if (active) {
          setUser(normalizeUser(sessionUser))
          setAuthLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setAuthLoading(false)
        }
      })

    const subscription = authService.onAuthStateChange((sessionUser) => {
      setUser(normalizeUser(sessionUser))
      setAuthLoading(false)
    })

    return () => {
      active = false
      subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      authLoading,
      backendLabel: isSupabaseConfigured ? 'Supabase' : 'Demo storage',
      signUp: authService.signUp,
      signIn: authService.signIn,
      signOut: authService.signOut,
    }),
    [authLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
