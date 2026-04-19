import { AppShell } from '../components/layout/AppShell'
import { SectionHeading } from '../components/common/SectionHeading'
import { useAppData } from '../hooks/useAppData'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function ProfilePage() {
  const { user } = useAuth()
  const { courses, assignments, sessions } = useAppData()
  useDocumentTitle('CampusFlow | Profile')

  return (
    <AppShell
      title="Profile"
      subtitle="Keep your account details and semester activity in one clean view."
    >
      <section className="surface-card page-section">
        <SectionHeading
          eyebrow="Account"
          title={user?.name || 'Student profile'}
          description="Your workspace stays personal to you across courses, assignments, and study sessions."
        />
        <div className="detail-grid">
          <div>
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div>
            <span>Courses</span>
            <strong>{courses.length}</strong>
          </div>
          <div>
            <span>Assignments</span>
            <strong>{assignments.length}</strong>
          </div>
          <div>
            <span>Study sessions</span>
            <strong>{sessions.length}</strong>
          </div>
          <div>
            <span>Member since</span>
            <strong>CampusFlow launch user</strong>
          </div>
          <div>
            <span>Focus</span>
            <strong>Stay ahead of deadlines</strong>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

export default ProfilePage
