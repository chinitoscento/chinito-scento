import { createClient } from '@supabase/supabase-js'
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabaseReady = Boolean(supabaseUrl && key)
// Public anon key only. Never put a service role key in this project.
export const supabase = supabaseReady ? createClient(supabaseUrl, key) : null
