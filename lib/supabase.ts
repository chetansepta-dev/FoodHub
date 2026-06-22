import { createClient } from '@supabase/supabase-js'

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
if (supabaseUrl.endsWith('/rest/v1/')) {
    supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - 9)
} else if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - 8)
}
// Clean trailing slashes
supabaseUrl = supabaseUrl.replace(/\/+$/, '')

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)