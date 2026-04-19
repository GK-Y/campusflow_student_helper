import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from '../components/common/LoadingScreen'

export function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <LoadingScreen label="Checking account" fullScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
