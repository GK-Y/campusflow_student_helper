import { supabase } from './supabase'

function requireData(result, message) {
  if (result.error) {
    throw new Error(result.error.message || message)
  }

  return result.data
}

export const supabaseAuthService = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    return data.session?.user ?? null
  },

  onAuthStateChange(callback) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })

    return subscription
  },

  async signUp({ email, password, name }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data.user
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      throw new Error(error.message)
    }

    return data.user
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  },
}

function createSupabaseRepo(table, orderColumn) {
  return {
    async list(userId) {
      const result = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
        .order(orderColumn, { ascending: true })

      return requireData(result, `Could not load ${table}.`)
    },

    async create(userId, payload) {
      const result = await supabase.from(table).insert({ user_id: userId, ...payload }).select().single()
      return requireData(result, `Could not create ${table.slice(0, -1)}.`)
    },

    async update(userId, id, payload) {
      const result = await supabase
        .from(table)
        .update(payload)
        .eq('user_id', userId)
        .eq('id', id)

      requireData(result, `Could not update ${table.slice(0, -1)}.`)
    },

    async remove(userId, id) {
      const result = await supabase.from(table).delete().eq('user_id', userId).eq('id', id)
      requireData(result, `Could not delete ${table.slice(0, -1)}.`)
    },
  }
}

const courseRepo = createSupabaseRepo('courses', 'created_at')
const assignmentRepo = createSupabaseRepo('assignments', 'due_date')
const sessionRepo = createSupabaseRepo('study_sessions', 'session_date')

export const supabaseDataService = {
  getCourses: courseRepo.list,
  createCourse: courseRepo.create,
  updateCourse: courseRepo.update,
  deleteCourse: courseRepo.remove,
  getAssignments: assignmentRepo.list,
  createAssignment: assignmentRepo.create,
  updateAssignment: assignmentRepo.update,
  deleteAssignment: assignmentRepo.remove,
  getStudySessions: sessionRepo.list,
  createStudySession: sessionRepo.create,
  updateStudySession: sessionRepo.update,
  deleteStudySession: sessionRepo.remove,
}
