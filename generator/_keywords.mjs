import {JSDOM} from "jsdom";
import path from "path";


const keywords = (await async function() {
    const glossaryFile = path.normalize(path.join(import.meta.dirname, '../website/glossary.html'));
    const glossary = (await JSDOM.fromFile(glossaryFile)).window.document;

    let glossaryMapping = {};
    for (const abbreviation of glossary.querySelectorAll('dt abbr')) {
        glossaryMapping[abbreviation.textContent] = abbreviation.outerHTML;
    }

    return glossaryMapping;
});

export async function transformKeywords(keywordsSeperatedByComma) {
    const glossary = await keywords();
    return keywordsSeperatedByComma.split(",").map(word => {
        const trimmedWord = word.trim();
        if (glossary[trimmedWord]) {
            return glossary[trimmedWord];
        }
        return trimmedWord;
    }).join(', ');
}