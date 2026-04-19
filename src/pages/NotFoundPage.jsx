import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function NotFoundPage() {
  useDocumentTitle('CampusFlow | Not found')

  return (
    <div className="not-found-page">
      <p className="eyebrow">404</p>
      <h1>That page is off the timetable.</h1>
      <p>The route you opened does not exist or has been moved.</p>
      <Link className="button button-primary" to="/">
        Back to home
      </Link>
    </div>
  )
}

export default NotFoundPage
