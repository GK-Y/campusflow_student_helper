import { Link } from 'react-router-dom'
import { AuthForm } from '../components/forms/AuthForm'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function SignupPage() {
  useDocumentTitle('CampusFlow | Create account')

  return (
    <div className="auth-page">
      <AuthForm mode="signup" />
      <p className="auth-page-note">
        Already registered? <Link to="/login">Log in here</Link>.
      </p>
    </div>
  )
}

export default SignupPage
