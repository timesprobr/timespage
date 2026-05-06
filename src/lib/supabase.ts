import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hgndulxohmkkkpdimoym.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbmR1bHhvaG1ra2twZGltb3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1Mzk5MjEsImV4cCI6MjA5MzExNTkyMX0.JTS_JQwVfVJqkaK1AOd1Q0q7mtD-Jwh4n1TG6SbJppo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Error Handling helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleSupabaseError(error: any, operationType: OperationType, path: string | null) {
  console.error(`Supabase Error [${operationType}] on ${path}:`, error);
  throw error;
}
