export function NoticeBanner({ tone = 'neutral', children }) {
  return <div className={`notice notice-${tone}`}>{children}</div>
}
