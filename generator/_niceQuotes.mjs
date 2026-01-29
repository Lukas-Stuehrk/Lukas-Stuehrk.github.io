const ALLOWED_TAGS = new Set([
    "P",
    "SPAN",
    "DIV",
    "LI",
    "TD",
    "TH",
    "BLOCKQUOTE",
    "FIGCAPTION",
    "CAPTION",
    "EM",
    "STRONG",
    "B",
    "I",
    "U",
    "SMALL",
    "MARK",
    "CITE",
    "Q",
    "A",
    "H1", "H2", "H3", "H4", "H5", "H6"
]);

const EXCLUDED_TAGS = new Set([
    "CODE",
    "PRE",
    "SCRIPT",
    "STYLE",
    "TEXTAREA",
    "INPUT",
    "KBD",
    "SAMP",
    "VAR",
    "NOSCRIPT",
    "MATH",
    "SVG"
]);

function isInsideExcludedContainer(node) {
    let parent = node.parentNode;
    while (parent) {
        if (parent.nodeType === 1 && EXCLUDED_TAGS.has(parent.tagName)) {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
}

function isInsideAllowedContainer(node) {
    let parent = node.parentNode;
    while (parent) {
        if (parent.nodeType === 1 && ALLOWED_TAGS.has(parent.tagName)) {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
}

function smartenQuotes(text) {
    let result = "";
    let doubleOpen = true;
    let singleOpen = true;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const prev = text[i - 1];
        const next = text[i + 1];

        if (char === "'") {
            if (/\w/.test(prev) && /\w/.test(next)) {
                result += "’";
            } else {
                result += singleOpen ? "‘" : "’";
                singleOpen = !singleOpen;
            }
            continue;
        }

        if (char === '"') {
            result += doubleOpen ? "“" : "”";
            doubleOpen = !doubleOpen;
            continue;
        }

        if (char === '.' && next === '.' && text[i + 2] === '.') {
            result += "…";
            i += 2;
            continue;
        }

        result += char;
    }

    return result;
}

export function niceQuotes(window) {
    const walker = window.document.createTreeWalker(
        window.document.body,
        window.NodeFilter.SHOW_TEXT
    );

    let node;
    while ((node = walker.nextNode())) {
        if (
            isInsideAllowedContainer(node) &&
            !isInsideExcludedContainer(node)
        ) {
            node.nodeValue = smartenQuotes(node.nodeValue);
        }
    }
}
