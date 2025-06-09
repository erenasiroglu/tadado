import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://fmfsknxseohmwvahcxgj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZnNrbnhzZW9obXd2YWhjeGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzkxNjYsImV4cCI6MjA2NDk1NTE2Nn0.VBiqgR9xc2qxV-w6H6QJkpsFWEb-9kniw_93a84yNMk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
}); 