import highlightJS from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import swift from 'highlight.js/lib/languages/swift';
import {codeLanguage, readFile} from "./_files.mjs";

highlightJS.registerLanguage('javascript', javascript);
highlightJS.registerLanguage('css', css);
highlightJS.registerLanguage('swift', swift);


export function highlightCode(code, language) {
    return highlightJS.highlight(code, {language: language}).value;
}


export async function createCodeListingForFile(fileUrl, element) {
    const language = codeLanguage(fileUrl);
    const contents = await readFile(new URL(fileUrl));
    const highlightedContents = highlightCode(contents, language.toLowerCase());
    replaceCodeElement(element, language, highlightedContents);
}

export async function createCodeListing(codeElement) {
    const language = codeElement.getAttribute('data-language');
    codeElement.removeAttribute('data-language');
    const highlightedContents = highlightCode(codeElement.textContent, language.toLowerCase());
    replaceCodeElement(codeElement, language, highlightedContents);
}

function replaceCodeElement(codeElement, language, highlightedContents) {
    codeElement.outerHTML = `
            <div class="code">
                <div class="header">
                    <dl>
                        <dt class="visually-hidden">Code language:</dt>
                        <dd>${language}</dd>
                    </dl>
                    <ul role="menu">
                        <li role="menuitem">
                            <button>Copy to clipboard</button>
                        </li>
                    </ul>
                </div>
                <pre>${highlightedContents}</pre>
        </div>
        `;
}