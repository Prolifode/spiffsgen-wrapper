import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

interface PackOptions {
  blockSize?: number;
  pageSize?: number;
  spiffSize?: number;
}

class SpiffsGen {
  private spiffsGenPath: string;

  constructor() {
    this.spiffsGenPath = this.getSpiffsGenPath();
    this.ensureExecutable(this.spiffsGenPath);
  }

  /**
   * Ensures that the specified file is executable.
   * @param {string} filePath - The path to the file to check.
   */
  private ensureExecutable(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const isExecutable = (stat.mode & fs.constants.X_OK) !== 0;

        if (!isExecutable) {
          fs.chmodSync(filePath, 0o755);
          console.log(`Permissions updated for ${filePath}`);
        }
      } else {
        throw new Error(`File not found: ${filePath}`);
      }
    } catch (err) {
      console.error(`Error ensuring executable permissions:`, err);
    }
  }

  /**
   * Determines the path to the appropriate spiffsgen.py script.
   * @returns {string} The full path to the spiffsgen.py script.
   */
  private getSpiffsGenPath(): string {
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
  private execute(
    args: string[],
    callback: (error: Error | null, stdout: string | null) => void,
  ): void {
    const fullCommand = `python "${this.spiffsGenPath}" ${args.join(' ')}`;
    exec(fullCommand, (error, stdout, stderr) => {
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
  pack(
    sourceDir: string,
    outputFile: string,
    options: PackOptions = {},
    callback: (error: Error | null, stdout: string | null) => void,
  ): void {
    const args: string[] = [
      `${options.spiffSize || 131072}`,
      sourceDir,
      outputFile,
    ];

    if (options.blockSize)
      args.push('--block-size', options.blockSize.toString());
    if (options.pageSize) args.push('--page-size', options.pageSize.toString());

    this.execute(args, callback);
  }
}

export default SpiffsGen;
