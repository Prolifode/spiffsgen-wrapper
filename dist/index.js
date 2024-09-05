"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class SpiffsGen {
    spiffsGenPath;
    constructor() {
        this.spiffsGenPath = this.getSpiffsGenPath();
        this.ensureExecutable(this.spiffsGenPath);
    }
    /**
     * Ensures that the specified file is executable.
     * @param {string} filePath - The path to the file to check.
     */
    ensureExecutable(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath);
                const isExecutable = (stat.mode & fs.constants.X_OK) !== 0;
                if (!isExecutable) {
                    fs.chmodSync(filePath, 0o755);
                    console.log(`Permissions updated for ${filePath}`);
                }
            }
            else {
                throw new Error(`File not found: ${filePath}`);
            }
        }
        catch (err) {
            console.error(`Error ensuring executable permissions:`, err);
        }
    }
    /**
     * Determines the path to the appropriate spiffsgen.py script.
     * @returns {string} The full path to the spiffsgen.py script.
     */
    getSpiffsGenPath() {
        // Assuming spiffsgen.py is in the bin directory within the project
        const scriptPath = path.join(__dirname, '..', 'bin', 'spiffsgen.py');
        if (!fs.existsSync(scriptPath)) {
            throw new Error(`spiffsgen.py not found at path: ${scriptPath}`);
        }
        return scriptPath;
    }
    /**
     * Executes a command using spiffsgen.py.
     * @param {string[]} args - The arguments to pass to the command.
     * @param {(error: Error | null, stdout: string | null) => void} callback - Callback function to handle the command output.
     */
    execute(args, callback) {
        const fullCommand = `python "${this.spiffsGenPath}" ${args.join(' ')}`;
        (0, child_process_1.exec)(fullCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${fullCommand}:`, error);
                callback(error, null);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                callback(new Error(stderr), null);
                return;
            }
            callback(null, stdout);
        });
    }
    /**
     * Packs a directory into a spiffs file with custom options.
     * @param {string} sourceDir - The directory to pack.
     * @param {string} outputFile - The output .spiffs file.
     * @param {PackOptions} [options={}] - Custom options for block size, page size, and spiffs size.
     * @param {(error: Error | null, stdout: string | null) => void} callback - Callback function to handle the command output.
     */
    pack(sourceDir, outputFile, options = {}, callback) {
        const args = [
            `${options.spiffSize || 131072}`,
            sourceDir,
            outputFile,
        ];
        if (options.blockSize)
            args.push('--block-size', options.blockSize.toString());
        if (options.pageSize)
            args.push('--page-size', options.pageSize.toString());
        this.execute(args, callback);
    }
}
exports.default = SpiffsGen;
