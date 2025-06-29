import path from "path";
import {promises as fs} from "fs";

export class BuildEnvironment {
    /**
     * The full path of the directory where the output will be written to.
     *
     * @type {string}
     */
    outDirectory;

    /**
     * The full path of the website's root directory, so basically the root of the repository.
     *
     * @type {string};
     */
    rootDirectory;

    websiteRootDirectory;

    constructor(rootDirectory) {
        if (!rootDirectory) {
            rootDirectory = path.normalize(path.join(import.meta.dirname, '../'));
        }
        this.rootDirectory = rootDirectory;
        this.outDirectory = path.join(rootDirectory, 'docs');
        this.websiteRootDirectory = path.join(rootDirectory, 'website');
    }

    /**
     *
     * @param {string} sourcePath
     * @returns {string}
     */
    sourcePath(sourcePath) {
        return path.normalize(path.join(this.websiteRootDirectory, sourcePath));
    }

    relativePath(fullPath) {
        return path.relative(this.websiteRootDirectory, fullPath);
    }

    async createOutputDirectory() {
       try {
           await fs.access(this.outDirectory);
           await fs.rm(this.outDirectory, { recursive: true });
       } catch(ignored) {}
        await fs.mkdir(this.outDirectory);
    }

    async copyFile(sourcePath) {
        let fullPath = this.sourcePath(sourcePath);
        const relativePath = path.relative(this.websiteRootDirectory, fullPath);
        const targetPath = path.join(this.outDirectory, relativePath);
        await fs.mkdir(path.dirname(targetPath), {recursive: true});
        await fs.copyFile(fullPath, targetPath);
    }

    async copyRootFile(relativeSourcePath, relativeTargetPath) {
        const fullSourcePath = path.join(this.rootDirectory, relativeSourcePath);
        const fullTargetPath = path.join(this.outDirectory, relativeTargetPath);
        await fs.mkdir(path.dirname(fullTargetPath), {recursive: true});
        await fs.copyFile(fullSourcePath, fullTargetPath);
    }

    async writeFile(relativePath, output) {
        let fullPath = path.join(this.outDirectory, relativePath);
        await fs.mkdir(path.dirname(fullPath), {recursive: true});
        await fs.writeFile(fullPath, output);
    }
}

export function createContext(rootDirectory) {
    const baseUrl = 'https://lukas.stuehrk.net/';

    class Page {
        /** @type {string} */
        #sourceFile;

        constructor(fullPath) {
            this.#sourceFile = fullPath;
        }
    }
}
