import { useCallback, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { CourseForm } from '../components/forms/CourseForm'
import { EmptyState } from '../components/common/EmptyState'
import { NoticeBanner } from '../components/common/NoticeBanner'
import { SectionHeading } from '../components/common/SectionHeading'
import { useAppData } from '../hooks/useAppData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function CoursesPage() {
  const { courses, assignments, createCourse, updateCourse, deleteCourse, error } = useAppData()
  const [editingCourse, setEditingCourse] = useState(null)
  const [saving, setSaving] = useState(false)
  useDocumentTitle('CampusFlow | Courses')

  const assignmentCounts = useMemo(() => {
    return assignments.reduce((counts, assignment) => {
      counts[assignment.course_id] = (counts[assignment.course_id] || 0) + 1
      return counts
    }, {})
  }, [assignments])

  const handleSubmit = useCallback(
    async (payload) => {
      setSaving(true)

      try {
        if (editingCourse) {
          await updateCourse(editingCourse.id, payload)
          setEditingCourse(null)
          return
        }

        await createCourse(payload)
      } finally {
        setSaving(false)
      }
    },
    [createCourse, editingCourse, updateCourse],
  )

  return (
    <AppShell
      title="Courses"
      subtitle="Create a clear home for every subject before you plan deadlines around it."
    >
      {error ? <NoticeBanner tone="danger">{error}</NoticeBanner> : null}

      <section className="surface-card page-section">
        {editingCourse ? <NoticeBanner tone="highlight">Editing course: {editingCourse.title}</NoticeBanner> : null}
        <SectionHeading
          eyebrow={editingCourse ? 'Edit course' : 'Add course'}
          title={editingCourse ? 'Update your course details' : 'Create a course hub'}
          description="Each course acts as the anchor for assignments and study sessions."
        />
        <CourseForm
          busy={saving}
          initialData={editingCourse}
          onCancel={() => setEditingCourse(null)}
          onSubmit={handleSubmit}
        />
      </section>

      <section className="surface-card page-section">
        <SectionHeading
          eyebrow="Course list"
          title="Your semester map"
          description="Keep instructor names, codes, and workload together."
        />

        {courses.length ? (
          <div className="feature-grid">
            {courses.map((course) => (
              <article
                className={`course-card course-${course.color} ${editingCourse?.id === course.id ? 'item-editing' : ''}`}
                key={course.id}
              >
                <p className="eyebrow">{course.code}</p>
                <h3>{course.title}</h3>
                <p>{course.instructor}</p>
                <div className="card-meta-row">
                  <span>{assignmentCounts[course.id] || 0} assignments</span>
                  <div className="inline-actions">
                    <button className="text-button edit-text" onClick={() => setEditingCourse(course)}>
                      Edit
                    </button>
                    <button className="text-button danger-text" onClick={() => deleteCourse(course.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No courses added"
            description="Add your subjects first, then connect every deliverable to them."
          />
        )}
      </section>
    </AppShell>
  )
}

export default CoursesPage
