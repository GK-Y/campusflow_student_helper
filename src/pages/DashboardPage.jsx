import { useMemo } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { EmptyState } from '../components/common/EmptyState'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { NoticeBanner } from '../components/common/NoticeBanner'
import { SectionHeading } from '../components/common/SectionHeading'
import { StatusBadge } from '../components/common/StatusBadge'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate, formatDateTime, getDaysUntil } from '../utils/date'

function DashboardPage() {
  const { courses, assignments, sessions, loading, error } = useAppData()
  const { user } = useAuth()
  useDocumentTitle('CampusFlow | Dashboard')

  const stats = useMemo(() => {
    const pendingAssignments = assignments.filter((item) => item.status !== 'submitted')
    const dueSoon = pendingAssignments.filter((item) => getDaysUntil(item.due_date) <= 7)
    const weeklyMinutes = sessions.reduce((total, session) => total + session.duration_minutes, 0)

    return [
      { label: 'Courses', value: courses.length, detail: 'Active semester map' },
      { label: 'Due in 7 days', value: dueSoon.length, detail: 'Assignments needing attention' },
      { label: 'Planned study minutes', value: weeklyMinutes, detail: 'Scheduled deep work' },
    ]
  }, [assignments, courses.length, sessions])

  const upcomingAssignments = useMemo(
    () => assignments.filter((item) => item.status !== 'submitted').slice(0, 4),
    [assignments],
  )

  const nextSessions = useMemo(() => sessions.slice(0, 4), [sessions])

  return (
    <AppShell
      title="Dashboard"
      subtitle="Monitor deadlines, balance your study load, and keep every course visible."
    >
      {error ? <NoticeBanner tone="danger">{error}</NoticeBanner> : null}

      {loading ? <LoadingScreen label="Loading dashboard" /> : null}

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p className="stat-label">{stat.label}</p>
            <div className="stat-main-row">
              <strong>{stat.value}</strong>
              <span>{stat.detail}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="two-column-grid">
        <article className="surface-card">
          <SectionHeading
            eyebrow={`Hi ${user?.name?.split(' ')[0] || 'Student'}`}
            title="Upcoming deadlines"
            description="Prioritize the tasks that could slip this week."
          />
          {upcomingAssignments.length ? (
            <div className="list-stack">
              {upcomingAssignments.map((assignment) => (
                <div className="list-item" key={assignment.id}>
                  <div>
                    <strong>{assignment.title}</strong>
                    <p>
                      Due {formatDate(assignment.due_date)} · {assignment.priority} priority
                    </p>
                  </div>
                  <StatusBadge status={assignment.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No assignments yet"
              description="Start by adding coursework so CampusFlow can calculate your workload."
            />
          )}
        </article>

        <article className="surface-card">
          <SectionHeading
            eyebrow="Planner"
            title="Next study blocks"
            description="Your focused sessions appear here in time order."
          />
          {nextSessions.length ? (
            <div className="list-stack">
              {nextSessions.map((session) => (
                <div className="list-item" key={session.id}>
                  <div>
                    <strong>{session.title}</strong>
                    <p>
                      {formatDateTime(session.session_date)} · {session.duration_minutes} minutes
                    </p>
                  </div>
                  <span className="pill">{session.format}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No study sessions planned"
              description="Map out revision blocks to make your week realistic."
            />
          )}
        </article>
      </section>
    </AppShell>
  )
}

export default DashboardPage
