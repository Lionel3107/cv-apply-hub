
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kifyevnjincgqhszqyis.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZnlldm5qaW5jZ3Foc3pxeWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjQ4MDAsImV4cCI6MjA1OTM0MDgwMH0.fMRJEgd1rwy77um8pHSv3CstDbP1bc3Xc-ULSUNSAug";

export const supabase = 
createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);