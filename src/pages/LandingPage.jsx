import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function LandingPage() {
  const { user } = useAuth()
  useDocumentTitle('CampusFlow | Academic planning for students')

  return (
    <div className="landing-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Plan clearly</p>
          <h1>Coursework, deadlines, and study sessions in one place.</h1>
          <p>Built for students who want less clutter and better control.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to={user ? '/dashboard' : '/signup'}>
              {user ? 'Open dashboard' : 'Start planning'}
            </Link>
            <Link className="button button-secondary" to="/login">
              Log in
            </Link>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="metric-card">
            <strong>Courses</strong>
            <span>Keep every subject organized</span>
          </div>
          <div className="metric-card">
            <strong>Deadlines</strong>
            <span>Track what is due next</span>
          </div>
          <div className="metric-card">
            <strong>Sessions</strong>
            <span>Reserve time to actually study</span>
          </div>
        </div>
      </section>

      <section className="feature-grid landing-section">
        <article className="surface-card">
          <p className="eyebrow">Focus</p>
          <h2>See your week at a glance.</h2>
          <p>Know what matters first.</p>
        </article>
        <article className="surface-card">
          <p className="eyebrow">Flow</p>
          <h2>Plan by course, not by chaos.</h2>
          <p>Move from overview to action fast.</p>
        </article>
      </section>
    </div>
  )
}

export default LandingPage
