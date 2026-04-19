import { Suspense } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { LoadingScreen } from './components/common/LoadingScreen'

function App() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading page" />}>
      <AppRoutes />
    </Suspense>
  )
}

export default App
