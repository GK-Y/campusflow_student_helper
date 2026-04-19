import { useEffect, useRef, useState } from 'react'
import { courseColorOptions } from '../../utils/constants'

const initialValues = {
  title: '',
  code: '',
  instructor: '',
  color: 'violet',
}

export function CourseForm({ initialData, onSubmit, onCancel, busy }) {
  const inputRef = useRef(null)
  const [values, setValues] = useState(initialData || initialValues)

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
    setValues(initialValues)
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Course title
          <input
            ref={inputRef}
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Data Structures"
            required
          />
        </label>
        <label>
          Course code
          <input
            name="code"
            value={values.code}
            onChange={handleChange}
            placeholder="CSE-203"
            required
          />
        </label>
        <label>
          Instructor
          <input
            name="instructor"
            value={values.instructor}
            onChange={handleChange}
            placeholder="Dr. Mehta"
            required
          />
        </label>
        <label>
          Accent
          <select name="color" value={values.color} onChange={handleChange}>
            {courseColorOptions.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button className="button button-primary" disabled={busy} type="submit">
          {busy ? 'Saving...' : initialData ? 'Update course' : 'Add course'}
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
