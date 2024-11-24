/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.geuuniao.com.br',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.geuuniao.com.br/sitemap.xml',
      'https://www.geuuniao.com.br/sitemap-1.xml',
      'https://www.geuuniao.com.br/sitemap-2.xml'
    ],
    policy: [
      { userAgent: '*', disallow: ['/outstatic/*', '/api/*'] }
    ]
  },
  changefreq: 'daily',
  priority: 0.8,
  sitemapSize: 5000,
  exclude: ['/outstatic/*', '/api/*'],
  generateIndexSitemap: true,
  autoLastmod: true,
  lastmodDate: true,
};
