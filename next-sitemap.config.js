/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // URL base do site
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.geuuniao.com.br',

  // Gerar o arquivo robots.txt automaticamente
  generateRobotsTxt: false,

  // Frequência de atualização do conteúdo
  changefreq: 'daily',

  // Prioridade para as páginas no sitemap
  priority: 0.8,

  // Tamanho máximo do sitemap (número de URLs por sitemap)
  sitemapSize: 5000,

  // Excluir diretórios ou páginas específicas do sitemap
  exclude: ['/outstatic/*', '/api/*'],

  // Gerar sitemap índice (se habilitado, cria um arquivo sitemap.xml que indexa outros sitemaps)
  generateIndexSitemap: false,

  // Adicionar a tag <lastmod/> automaticamente nas páginas do sitemap
  autoLastmod: true,

  // Incluir data no campo lastmod
  lastmodDate: true,

  // Definir se o sitemap gerado deve ter barra final na URL (por padrão, é false)
  trailingSlash: false,
};
