import {build, transform} from 'esbuild';

/**
 * @param {string[]} entryPoints
 * @param {BuildEnvironment} buildEnvironment
 * @returns {Promise<void>}
 */
export async function buildStylesheets(entryPoints, buildEnvironment) {
    await build({
        entryPoints: entryPoints.map(entryPoint => buildEnvironment.sourcePath(entryPoint)),
        bundle: true,
        outdir: buildEnvironment.outDirectory,
        outbase: buildEnvironment.websiteRootDirectory,
        sourcemap: "linked",
        loader: {
            ".svg": "dataurl",
        }
    });
}


/**
 * @param {string} css
 */
export async function transformCss(css) {
    const result = await transform(css, {
        loader: 'css',
        minify: true
    });

    return result.code;
}
