import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/assignments', label: 'Assignments' },
  { to: '/planner', label: 'Planner' },
  { to: '/profile', label: 'Profile' },
]

export function AppShell({ title, subtitle, actions, children }) {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <NavLink className="brand" to="/dashboard">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark-inner" />
            </span>
            <div>
              <strong>CampusFlow</strong>
              <span>Student planning hub</span>
            </div>
          </NavLink>
          <nav className="nav-links" aria-label="Primary">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="user-chip-mark">{user?.name?.slice(0, 1)?.toUpperCase() || 'S'}</span>
            <div>
              <strong>{user?.name}</strong>
              <p>{user?.email}</p>
            </div>
          </div>
          <button className="button button-secondary button-block" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="content-area">
        <header className="page-header">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {actions ? <div className="header-actions">{actions}</div> : null}
        </header>
        {children}
      </main>
    </div>
  )
}
