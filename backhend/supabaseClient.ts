import { createClient, SupabaseClient } from '@supabase/supabase-js';

// URL du projet Supabase
const SUPABASE_URL = 'https://sfgwjvqswcihbcwprd.supabase.co';

// Clés
const PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZ3dqdnFzd2NpaGJjd3Byd2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjE1ODEsImV4cCI6MjA3OTAzNzU4MX0.iOQV6nqFS_sNIQpCUpOOt5-9U_r2WXSzDOrWc-0p_8s';
const PRIVATE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZ3dqdnFzd2NpaGJjd3Byd2VwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ2MTU4MSwiZXhwIjoyMDc5MDM3NTgxfQ.-wlULcbnj6NhVHjkNB09FUTrRSxejaiBXQ6r0qlg0Bg';

/**
 * Retourne un client Supabase selon le rôle utilisateur
 * @param role "user" | "adminPro" | "admin"
 */
export const getSupabaseClient = (role: 'user' | 'adminPro' | 'admin'): SupabaseClient => {
  if (role === 'admin') {
    return createClient(SUPABASE_URL, PRIVATE_KEY);
  }
  // Par défaut, user ou adminPro → utilisent la clé publique
  return createClient(SUPABASE_URL, PUBLIC_KEY);
};
