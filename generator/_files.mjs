import {promises as fs} from "fs";
import path from "path";

/**
 * @param {string} filePath
 * @returns {boolean}
 */
export function isHtmlFile(filePath) {
    return path.extname(filePath).toLowerCase() === '.html';
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
export function isCssFile(filePath) {
    return path.extname(filePath).toLowerCase() === '.css';
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
export function isJsFile(filePath) {
    return ['.js', '.mjs'].includes(path.extname(filePath).toLowerCase());
}

export function codeLanguage(filePath) {
    switch (path.extname(filePath)) {
        case '.json': return "JSON";
        case '.js': return "JavaScript";
        case '.mjs': return "JavaScript";
        case '.swift': return "Swift";
        default: throw new Error("Unrecognized language");
    }
}

/**
 * Recursively collects all HTML files in the given directory.
 *
 * @param {string} dir
 * @returns {Promise<string[]>} An array with absolute file paths.
 */
export async function getHtmlFiles(dir) {
    let htmlFiles = [];

    const files = await fs.readdir(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            htmlFiles = htmlFiles.concat(await getHtmlFiles(filePath));
        } else if (isHtmlFile(filePath)) {
            htmlFiles.push(filePath);
        }
    }

    return htmlFiles;
}


export async function readFile(filePath) {
    return await fs.readFile(filePath, 'utf8');
}