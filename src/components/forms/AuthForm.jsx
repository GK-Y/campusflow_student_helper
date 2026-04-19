import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AuthForm({ mode = 'login' }) {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const nameRef = useRef(null)
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (isSignup) {
        await signUp(values)
      } else {
        await signIn(values)
      }

      const destination = location.state?.from?.pathname || '/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed.')

      if (isSignup) {
        nameRef.current?.focus()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <div>
        <p className="eyebrow">Student workspace</p>
        <h1>{isSignup ? 'Create your CampusFlow account' : 'Log in to CampusFlow'}</h1>
        <p>
          Manage coursework, deadlines, and study blocks from a calm, readable dashboard.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignup ? (
          <label>
            Full name
            <input
              ref={nameRef}
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Aarav Singh"
              required
            />
          </label>
        ) : null}

        <label>
          Email address
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="student@college.edu"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            minLength={6}
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button-primary button-block" disabled={submitting} type="submit">
          {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          {isSignup ? 'Already have an account?' : 'New here?'}{' '}
          <Link to={isSignup ? '/login' : '/signup'}>
            {isSignup ? 'Log in' : 'Create an account'}
          </Link>
        </p>
      </div>
    </div>
  )
}
