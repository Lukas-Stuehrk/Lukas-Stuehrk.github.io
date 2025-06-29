import {BuildEnvironment} from "./_buildEnvironment.mjs";
import {getHtmlFiles} from "./_files.mjs";
import {buildStylesheets, transformCss} from "./_css.mjs";
import {runHtmlValidator} from "./_validator.mjs";
import {JSDOM, VirtualConsole} from "jsdom";
import path from "path";
import {createCodeListing, createCodeListingForFile, highlightCode} from "./_codeHiglighting.mjs";
import {transformKeywords} from "./_keywords.mjs";
import {createSitemap} from "./_sitemap.mjs";

const buildEnvironment = new BuildEnvironment();

await buildEnvironment.createOutputDirectory();

await Promise.all([
    'index.html',
    'about.html',
    'glossary.html',
    'impressum.html',
    'notes/index.html',
].map(async sourceFile => {
    // JSDOM doesn't support all new CSS features and throws errors because of it.
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", (error) => {
        if (typeof error === 'string' && error.includes('Could not parse CSS stylesheet')) {
            return;
        }
        console.error(error);
    });
    const jsdom = await JSDOM.fromFile(buildEnvironment.sourcePath(sourceFile), {virtualConsole});
    for (const style of jsdom.window.document.querySelectorAll('style')) {
        style.innerHTML = await transformCss(style.innerHTML);
    }
    await buildEnvironment.writeFile(sourceFile, jsdom.serialize());
}));

await Promise.all([
    'lukas.jpeg',
    'wood.svg',
    'js/code.js',
].map(sourceFile => buildEnvironment.copyFile(sourceFile)))

await buildStylesheets(['css/main.css'], buildEnvironment);

await buildEnvironment.copyRootFile('node_modules/highlight.js/styles/a11y-dark.css', 'css/code/dark.css');
await buildEnvironment.copyRootFile('node_modules/highlight.js/styles/a11y-light.css', 'css/code/light.css');
await buildEnvironment.copyRootFile('CNAME', 'CNAME');

let pages = [];
for (const filePath of await getHtmlFiles(buildEnvironment.sourcePath('notes/'))) {
    if ([buildEnvironment.sourcePath('notes/index.html'), buildEnvironment.sourcePath('notes/_template/template.html')].includes(filePath)) {
        continue;
    }
    console.log(`building ${filePath}`);
    const template = await JSDOM.fromFile(buildEnvironment.sourcePath('notes/_template/template.html'))
    const document = await JSDOM.fromFile(filePath);
    const replaceContent = (sourceSelector, targetSelector) => {
        const sourceElement = document.window.document.querySelector(sourceSelector);
        const targetElement = template.window.document.querySelector(targetSelector);
        targetElement.innerHTML = sourceElement.innerHTML;
    };
    const replaceElement = (sourceSelector, targetSelector) => {
        const sourceElement = document.window.document.querySelector(sourceSelector);
        const targetElement = template.window.document.querySelector(targetSelector);
        targetElement.outerHTML = sourceElement.outerHTML;
    }

    const codeBlocks = document.window.document.querySelectorAll('main>code[data-language]');
    for (const codeBlock of codeBlocks) {
        await createCodeListing(codeBlock, codeBlock);
    }

    const codeLinks = document.window.document.querySelectorAll('main > code > a');
    for (const codeLink of codeLinks) {
        await createCodeListingForFile(codeLink.href, codeLink.parentElement);
    }
    // Remove the syntax highlighting style sheets if not needed.
    if (!codeLinks.length && !codeBlocks.length) {
        for (const link of template.window.document.querySelectorAll('link.code')) {
            link.remove();
        }
    }

    replaceContent('title', 'title');
    replaceContent('h1', 'main#content h1');
    replaceContent('main', 'main#content>div');
    replaceElement('meta[name=description]', 'meta[name="description"]');

    const published = document.window.document.querySelector('.dt-published');
    let pageEntry = {
        relativePath:  path.join(path.dirname(buildEnvironment.relativePath(filePath)), '/'),
        lastModified: published.getAttribute('datetime'),
    };
    pages.push(pageEntry);
    let meta = `<p><strong>Published: </strong>${published.outerHTML}</p>`;
    const updated = document.window.document.querySelector('.dt-updated');
    if (updated) {
        meta += `<p><strong>Last update:</strong>${updated.outerHTML}</p>`;
        pageEntry.lastModified = updated.getAttribute('datetime');
    }
    const keywords = document.window.document.querySelector('meta[name="keywords"]');
    if (keywords) {
        meta += `<p><strong>Keywords: </strong>${await transformKeywords(keywords.content) }</p>`;
    }
    template.window.document.querySelector('main>aside').innerHTML = meta;

    const newRelativePath = path.join(path.dirname(buildEnvironment.relativePath(filePath)), 'index.html');
    await buildEnvironment.writeFile(newRelativePath, template.serialize());
}

for (const path of await getHtmlFiles(buildEnvironment.outDirectory)) {
    await runHtmlValidator(path);
}

buildEnvironment.writeFile('sitemap.xml', createSitemap(pages));