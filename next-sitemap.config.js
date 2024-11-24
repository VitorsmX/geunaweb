/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.geuuniao.com.br',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policy: [{ userAgent: '*', allow: "/", disallow: ['/outstatic/', '/api/'] }]
  },
  changefreq: 'daily',
  priority: 0.8,
  sitemapSize: 5000,
  exclude: ['/outstatic/*', '/api/*'],
  generateIndexSitemap: true, // Gera um índice único e centralizado
  autoLastmod: true,
  lastmodDate: true,
};