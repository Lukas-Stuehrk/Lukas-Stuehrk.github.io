import {spawn} from "node:child_process";

export async function runHtmlValidator(filePath) {
    try {
        console.log("linting", filePath)
        await run('vnu', [filePath]);
    } catch (error) {
        // TODO: Try to parse the error message of the linter.
        console.error('Error:', error);
    }
}

/**
 * Executes a subprocess.
 *
 * @param {string} command
 *   The command that is run (without arguments).
 * @param {string[]} args
 *   The arguments that are passed to the command.
 * @returns {Promise<{stdout: string, stderr: string, code: number|null}>}
 */
export async function run(command, args) {
    return new Promise((resolve, reject) => {
        let process = spawn(command, args);
        let stdout = '';
        process.stdout.on('data', (data) => {
            stdout += data;
        });
        let stderr = '';
        process.stderr.on('data', (data) => {
            stderr += data;
        });
        process.on('close', (code) => {
            const returnValue = {
                stdout: stdout,
                stderr: stderr,
                code: code
            };
            if (code === 0) {
                resolve(returnValue);
            } else {
                reject(returnValue);
            }
        });
    });
}
