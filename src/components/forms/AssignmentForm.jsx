import { useEffect, useRef, useState } from 'react'
import { assignmentStatuses } from '../../utils/constants'

const initialValues = {
  title: '',
  course_id: '',
  due_date: '',
  status: 'pending',
  priority: 'Medium',
}

export function AssignmentForm({ courses, initialData, onSubmit, onCancel, busy }) {
  const inputRef = useRef(null)
  const [values, setValues] = useState(
    initialData || {
      ...initialValues,
      course_id: courses[0]?.id || '',
    },
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(values)
    setValues({ ...initialValues, course_id: courses[0]?.id || '' })
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Assignment title
          <input
            ref={inputRef}
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Linked list lab"
            required
          />
        </label>

        <label>
          Course
          <select name="course_id" value={values.course_id} onChange={handleChange} required>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            name="due_date"
            value={values.due_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Status
          <select name="status" value={values.status} onChange={handleChange}>
            {assignmentStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        <label>
          Priority
          <select name="priority" value={values.priority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button className="button button-primary" disabled={busy} type="submit">
          {busy ? 'Saving...' : initialData ? 'Update assignment' : 'Add assignment'}
        </button>
        {initialData ? (
          <button className="button button-secondary" onClick={onCancel} type="button">
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  )
}
