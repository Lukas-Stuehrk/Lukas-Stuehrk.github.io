/**
 * @typedef {object} PageEntry;
 * @property {string} relativePath;
 * @property {string} lastModified.
 */

/**
 * @param {PageEntry[]} pages
 *
 * @returns {string}
 */
export function createSitemap(pages) {
    return `<?xml version="1.0" encoding="UTF-8"?>    
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://lukas.stuehrk.net/</loc>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
    </url>
    <url>
        <loc>https://lukas.stuehrk.net/about/</loc>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
    </url>
        <url>
        <loc>https://lukas.stuehrk.net/glossary.html</loc>
        <changefreq>weekly</changefreq>
        <priority>1</priority>
    </url>
    ${pages.map(page => {
        return `
        <url>
            <loc>https://lukas.stuehrk.net/${page.relativePath}</loc>
            <changefreq>weekly</changefreq>
            <priority>1</priority>
            <lastmod>${ page.lastModified }</lastmod>
        </url>
        `;
    }).join('\n')}
</urlset>`
}
