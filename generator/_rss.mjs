/**
 * @typedef {object} RssPageEntry;
 * @property {string} relativePath;
 * @property {string} lastModified;
 * @property {string} title;
 * @property {string} description;
 */

/**
 * @param {RssPageEntry[]} pages
 *
 * @returns {string}
 */
export function createRssFeed(pages) {
    const sortedPages = [...pages].sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    const lastBuildDate = sortedPages.length > 0 ? rfc822Date(sortedPages[0].lastModified) : rfc822Date(new Date().toISOString().slice(0, 10));

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Lukas Ehlers Stührk's Personal Website</title>
        <link>https://lukas.ehlers.stuehrk.net/</link>
        <description>Notes on web development</description>
        <language>en</language>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <atom:link href="https://lukas.ehlers.stuehrk.net/feed.xml" rel="self" type="application/rss+xml"/>
        ${sortedPages.map(page => `<item>
            <title>${escapeXml(page.title)}</title>
            <link>https://lukas.ehlers.stuehrk.net/${page.relativePath}</link>
            <guid>https://lukas.ehlers.stuehrk.net/${page.relativePath}</guid>
            <pubDate>${rfc822Date(page.lastModified)}</pubDate>
            <description>${escapeXml(page.description)}</description>
        </item>`).join('\n        ')}
    </channel>
</rss>`;
}

/**
 * Converts a YYYY-MM-DD date string to RFC 822 format.
 * @param {string} dateString
 * @returns {string}
 */
function rfc822Date(dateString) {
    const normalized = dateString.includes('T')
        ? (/[Z+-]/.test(dateString.slice(10)) ? dateString : dateString + 'Z')
        : dateString + 'T00:00:00Z';
    const date = new Date(normalized);
    return date.toUTCString();
}

/**
 * @param {string} str
 * @returns {string}
 */
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
