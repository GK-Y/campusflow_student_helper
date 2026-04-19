import { demoAuthService, demoDataService } from './demoStorage'
import { isSupabaseConfigured } from './supabase'
import { supabaseAuthService, supabaseDataService } from './supabaseStorage'

export { isSupabaseConfigured } from './supabase'

export const authService = isSupabaseConfigured ? supabaseAuthService : demoAuthService
export const dataService = isSupabaseConfigured ? supabaseDataService : demoDataService
