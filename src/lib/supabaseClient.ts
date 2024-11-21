import { createClient } from '@supabase/supabase-js';

// Acessando as variáveis de ambiente para configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criando uma única instância do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' },
});

export default supabase;
