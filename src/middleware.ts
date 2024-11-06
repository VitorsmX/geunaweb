import { NextRequest, NextResponse } from 'next/server';
import { Outstatic } from 'outstatic';
import fs from 'fs';
import path from 'path';

// Caminho para armazenar a sessão temporária no servidor
const TEMP_SESSION_PATH = path.join(process.cwd(), 'tmp', 'session.json');

// Função para carregar a sessão assíncrona e armazená-la no arquivo temporário
async function loadAndSaveSession() {
  const ostData = await Outstatic();
  const session = ostData.session;

  // Cria o diretório 'tmp' se não existir
  if (!fs.existsSync(path.dirname(TEMP_SESSION_PATH))) {
    fs.mkdirSync(path.dirname(TEMP_SESSION_PATH), { recursive: true });
  }

  // Salva a sessão em um arquivo JSON temporário
  fs.writeFileSync(TEMP_SESSION_PATH, JSON.stringify(session), 'utf8');
}

// Função para ler a sessão armazenada no arquivo temporário
function getSessionFromFile() {
  if (fs.existsSync(TEMP_SESSION_PATH)) {
    const sessionData = fs.readFileSync(TEMP_SESSION_PATH, 'utf8');
    return JSON.parse(sessionData);
  }
  return null;
}

// Função para excluir o arquivo de sessão (remover após validação ou expiração)
function deleteSessionFile() {
  if (fs.existsSync(TEMP_SESSION_PATH)) {
    fs.unlinkSync(TEMP_SESSION_PATH);
  }
}

// Classe para gerenciar a sessão de forma síncrona
class SessionManager {
  getSession() {
    return getSessionFromFile(); // Lê a sessão do arquivo temporário
  }

  hasSession() {
    return fs.existsSync(TEMP_SESSION_PATH); // Verifica se o arquivo de sessão existe
  }
}

// Instância do gerenciador de sessão
const sessionManager = new SessionManager();

// Middleware (sincrônico)
export function middleware(request: NextRequest) {
  // Carrega e salva a sessão na primeira requisição, se necessário
  if (!sessionManager.hasSession()) {
    loadAndSaveSession(); // Carrega e salva a sessão no arquivo temporário
  }

  // Verifica o ambiente (produção ou desenvolvimento)
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Recupera o domínio permitido a partir da variável de ambiente
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL || '';

  // Se estiver em ambiente de desenvolvimento, permite todas as requisições
  if (isDevelopment) {
    return NextResponse.next();
  }

  // Verifica a origem da requisição
  const origin = request.headers.get('Origin');

  // Se a origem não for permitida, retorna 403
  if (origin && origin !== allowedOrigin) {
    return NextResponse.json({ message: 'Acesso proibido. Origem não permitida.' }, { status: 403 });
  }

  // Condicional para rotas específicas que requerem verificação de sessão
  const isSessionRequiredRoute = request.url.includes('/api/delete/remove') || request.url.includes('/api/upload');

  if (isSessionRequiredRoute) {
    // Verifica se a sessão existe
    if (!sessionManager.hasSession()) {
      return NextResponse.json({ message: 'Sessão expirada ou não encontrada.' }, { status: 401 });
    }

    // (Opcional) Excluir a sessão após a validação (se necessário)
    deleteSessionFile();
  }

  // Se a origem for permitida e a sessão (se necessário) estiver válida, permite a requisição seguir
  const response = NextResponse.next();

  // Adiciona os cabeçalhos CORS para a resposta
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Configuração para aplicar o middleware apenas em rotas de API
export const config = {
  matcher: ['/api/:path*'],
};
