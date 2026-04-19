import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from '../hooks/useAuth'
import { dataService } from '../services/storageAdapter'
import { AppDataContext } from './app-data-context'

const defaultData = {
  courses: [],
  assignments: [],
  sessions: [],
}

export function AppDataProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refreshData = useCallback(async () => {
    if (!userId) {
      setData(defaultData)
      return
    }

    setLoading(true)
    setError('')

    try {
      const [courses, assignments, sessions] = await Promise.all([
        dataService.getCourses(userId),
        dataService.getAssignments(userId),
        dataService.getStudySessions(userId),
      ])

      startTransition(() => {
        setData({ courses, assignments, sessions })
      })
    } catch (err) {
      setError(err.message || 'Could not load your dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    async function syncData() {
      await refreshData()
    }

    syncData()
  }, [refreshData])

  const runMutation = useCallback(
    async (mutator) => {
      if (!userId) {
        return
      }

      setError('')

      try {
        await mutator()
        await refreshData()
      } catch (err) {
        setError(err.message || 'Could not save your changes.')
        throw err
      }
    },
    [refreshData, userId],
  )

  const value = useMemo(
    () => ({
      ...data,
      loading,
      error,
      refreshData,
      createCourse: (payload) => runMutation(() => dataService.createCourse(userId, payload)),
      updateCourse: (id, payload) => runMutation(() => dataService.updateCourse(userId, id, payload)),
      deleteCourse: (id) => runMutation(() => dataService.deleteCourse(userId, id)),
      createAssignment: (payload) =>
        runMutation(() => dataService.createAssignment(userId, payload)),
      updateAssignment: (id, payload) =>
        runMutation(() => dataService.updateAssignment(userId, id, payload)),
      deleteAssignment: (id) => runMutation(() => dataService.deleteAssignment(userId, id)),
      createStudySession: (payload) =>
        runMutation(() => dataService.createStudySession(userId, payload)),
      updateStudySession: (id, payload) =>
        runMutation(() => dataService.updateStudySession(userId, id, payload)),
      deleteStudySession: (id) => runMutation(() => dataService.deleteStudySession(userId, id)),
    }),
    [data, error, loading, refreshData, runMutation, userId],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}
