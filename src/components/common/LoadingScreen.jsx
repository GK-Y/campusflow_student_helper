export function LoadingScreen({ label = 'Loading', fullScreen = false }) {
  return (
    <div className={`loading-screen ${fullScreen ? 'loading-screen-full' : ''}`}>
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}
