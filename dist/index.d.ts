interface PackOptions {
    blockSize?: number;
    pageSize?: number;
    spiffSize?: number;
}
declare class SpiffsGen {
    private spiffsGenPath;
    constructor();
    /**
     * Ensures that the specified file is executable.
     * @param {string} filePath - The path to the file to check.
     */
    private ensureExecutable;
    /**
     * Determines the path to the appropriate spiffsgen.py script.
     * @returns {string} The full path to the spiffsgen.py script.
     */
    private getSpiffsGenPath;
    /**
     * Executes a command using spiffsgen.py.
     * @param {string[]} args - The arguments to pass to the command.
     * @param {(error: Error | null, stdout: string | null) => void} callback - Callback function to handle the command output.
     */
    private execute;
    /**
     * Packs a directory into a spiffs file with custom options.
     * @param {string} sourceDir - The directory to pack.
     * @param {string} outputFile - The output .spiffs file.
     * @param {PackOptions} [options={}] - Custom options for block size, page size, and spiffs size.
     * @param {(error: Error | null, stdout: string | null) => void} callback - Callback function to handle the command output.
     */
    pack(sourceDir: string, outputFile: string, options: PackOptions | undefined, callback: (error: Error | null, stdout: string | null) => void): void;
}
export default SpiffsGen;
