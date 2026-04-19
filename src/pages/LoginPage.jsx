import { Link } from 'react-router-dom'
import { AuthForm } from '../components/forms/AuthForm'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function LoginPage() {
  useDocumentTitle('CampusFlow | Log in')

  return (
    <div className="auth-page">
      <AuthForm mode="login" />
      <p className="auth-page-note">
        Need a new account? <Link to="/signup">Create one here</Link>.
      </p>
    </div>
  )
}

export default LoginPage
