import { createClient } from '@supabase/supabase-js';

// Acessando as variáveis de ambiente para configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

// Criando uma única instância do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
