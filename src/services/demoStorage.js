const DEMO_AUTH_KEY = 'campusflow_demo_auth'
const DEMO_USERS_KEY = 'campusflow_demo_users'

const randomId = () => crypto.randomUUID()

function readJson(key, fallback) {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : fallback
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getUserScopedKey(userId, resource) {
  return `campusflow_${userId}_${resource}`
}

function getAuthUser() {
  return readJson(DEMO_AUTH_KEY, null)
}

function emitAuthChange() {
  window.dispatchEvent(new Event('campusflow-auth-change'))
}

function withTimestamps(payload, existing = {}) {
  const timestamp = new Date().toISOString()

  return {
    ...existing,
    ...payload,
    updated_at: timestamp,
    created_at: existing.created_at || timestamp,
  }
}

function sortByDate(items, field) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left[field] || left.created_at).getTime()
    const rightDate = new Date(right[field] || right.created_at).getTime()
    return leftDate - rightDate
  })
}

export const demoAuthService = {
  async getSession() {
    return getAuthUser()
  },

  onAuthStateChange(callback) {
    const handler = () => callback(getAuthUser())
    window.addEventListener('campusflow-auth-change', handler)

    return {
      unsubscribe() {
        window.removeEventListener('campusflow-auth-change', handler)
      },
    }
  },

  async signUp({ email, password, name }) {
    const users = readJson(DEMO_USERS_KEY, [])

    if (users.some((user) => user.email === email)) {
      throw new Error('An account with this email already exists in demo mode.')
    }

    const newUser = {
      id: randomId(),
      email,
      password,
      name,
      user_metadata: { full_name: name },
    }

    users.push(newUser)
    writeJson(DEMO_USERS_KEY, users)
    writeJson(DEMO_AUTH_KEY, newUser)
    emitAuthChange()
    return newUser
  },

  async signIn({ email, password }) {
    const users = readJson(DEMO_USERS_KEY, [])
    const user = users.find((entry) => entry.email === email && entry.password === password)

    if (!user) {
      throw new Error('Incorrect email or password for demo mode.')
    }

    writeJson(DEMO_AUTH_KEY, user)
    emitAuthChange()
    return user
  },

  async signOut() {
    localStorage.removeItem(DEMO_AUTH_KEY)
    emitAuthChange()
  },
}

function readCollection(userId, resource) {
  return readJson(getUserScopedKey(userId, resource), [])
}

function writeCollection(userId, resource, records) {
  writeJson(getUserScopedKey(userId, resource), records)
}

function createRepository(resource, sortField) {
  return {
    async list(userId) {
      return sortByDate(readCollection(userId, resource), sortField)
    },

    async create(userId, payload) {
      const records = readCollection(userId, resource)
      const record = withTimestamps({ id: randomId(), user_id: userId, ...payload })
      records.push(record)
      writeCollection(userId, resource, records)
      return record
    },

    async update(userId, id, payload) {
      const records = readCollection(userId, resource)
      const nextRecords = records.map((record) =>
        record.id === id ? withTimestamps(payload, record) : record,
      )
      writeCollection(userId, resource, nextRecords)
    },

    async remove(userId, id) {
      const records = readCollection(userId, resource)
      writeCollection(
        userId,
        resource,
        records.filter((record) => record.id !== id),
      )
    },
  }
}

const courseRepo = createRepository('courses', 'created_at')
const assignmentRepo = createRepository('assignments', 'due_date')
const sessionRepo = createRepository('sessions', 'session_date')

export const demoDataService = {
  getCourses: courseRepo.list,
  createCourse: courseRepo.create,
  updateCourse: courseRepo.update,
  async deleteCourse(userId, id) {
    await courseRepo.remove(userId, id)

    const assignments = readCollection(userId, 'assignments').filter(
      (assignment) => assignment.course_id !== id,
    )
    const sessions = readCollection(userId, 'sessions').filter((session) => session.course_id !== id)

    writeCollection(userId, 'assignments', assignments)
    writeCollection(userId, 'sessions', sessions)
  },
  getAssignments: assignmentRepo.list,
  createAssignment: assignmentRepo.create,
  updateAssignment: assignmentRepo.update,
  deleteAssignment: assignmentRepo.remove,
  getStudySessions: sessionRepo.list,
  createStudySession: sessionRepo.create,
  updateStudySession: sessionRepo.update,
  deleteStudySession: sessionRepo.remove,
}
