import { useEffect, useRef, useState } from 'react'
import { sessionFormats } from '../../utils/constants'

const timeSlots = ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00']

function toDateInputValue(dateString) {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toTimeSlot(dateString) {
  if (!dateString) {
    return '09:00'
  }

  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const slot = `${hours}:${minutes}`
  return timeSlots.includes(slot) ? slot : '09:00'
}

const initialValues = {
  title: '',
  course_id: '',
  session_day: '',
  session_slot: '09:00',
  duration_minutes: 45,
  format: 'Deep work',
}

export function StudySessionForm({ courses, initialData, onSubmit, onCancel, busy }) {
  const inputRef = useRef(null)
  const [values, setValues] = useState(
    initialData
      ? {
          ...initialData,
          session_day: toDateInputValue(initialData.session_date),
          session_slot: toTimeSlot(initialData.session_date),
        }
      : {
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
    await onSubmit({
      ...values,
      session_date: `${values.session_day}T${values.session_slot}`,
      duration_minutes: Number(values.duration_minutes),
    })
    setValues({ ...initialValues, course_id: courses[0]?.id || '' })
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Session focus
          <input
            ref={inputRef}
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Revise sorting algorithms"
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
          Study date
          <input
            type="date"
            name="session_day"
            value={values.session_day}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time slot
          <select name="session_slot" value={values.session_slot} onChange={handleChange} required>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>

        <label>
          Duration (mins)
          <input
            min="15"
            step="15"
            type="number"
            name="duration_minutes"
            value={values.duration_minutes}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Format
          <select name="format" value={values.format} onChange={handleChange}>
            {sessionFormats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button className="button button-primary" disabled={busy} type="submit">
          {busy ? 'Saving...' : initialData ? 'Update session' : 'Add session'}
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
