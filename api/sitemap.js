export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://prasetyastudio.my.id/</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://prasetyastudio.my.id/tentang</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://prasetyastudio.my.id/layanan</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://prasetyastudio.my.id/artikel</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://prasetyastudio.my.id/hub-kami</loc>
    <lastmod>2025-07-29</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
}
