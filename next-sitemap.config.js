/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // URL base do site
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.geuuniao.com.br',

  // Gerar o arquivo robots.txt automaticamente
  generateRobotsTxt: true,

  // Configurações do robots.txt
  robotsTxtOptions: {
    // Definir políticas para os crawlers
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/outstatic/', '/api/'], // Bloquear diretórios específicos
        crawlDelay: 5, // Delay para evitar sobrecarga no servidor
      },
    ],
    // Adicionar mapas de site adicionais (se houver)
    additionalSitemaps: [
      'https://www.geuuniao.com.br/sitemap-0.xml',
    ],
  },

  // Frequência de atualização do conteúdo
  changefreq: 'daily',

  // Prioridade para as páginas no sitemap
  priority: 0.8,

  // Tamanho máximo do sitemap (número de URLs por sitemap)
  sitemapSize: 5000,

  // Excluir diretórios ou páginas específicas do sitemap
  exclude: ['/outstatic/*', '/api/*'],

  // Gerar sitemap índice (se habilitado, cria um arquivo sitemap.xml que indexa outros sitemaps)
  generateIndexSitemap: true,

  // Adicionar a tag <lastmod/> automaticamente nas páginas do sitemap
  autoLastmod: true,

  // Incluir data no campo lastmod
  lastmodDate: true,

  // Definir se o sitemap gerado deve ter barra final na URL (por padrão, é false)
  trailingSlash: false,
};
