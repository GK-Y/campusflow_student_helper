import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

const LandingPage = lazy(() => import('../pages/LandingPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const SignupPage = lazy(() => import('../pages/SignupPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const CoursesPage = lazy(() => import('../pages/CoursesPage'))
const AssignmentsPage = lazy(() => import('../pages/AssignmentsPage'))
const PlannerPage = lazy(() => import('../pages/PlannerPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <AssignmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <PlannerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
