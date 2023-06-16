import { readdir, unlink, access } from "fs/promises";
import { join } from "path";
/**
 * Deletes all .backup files in the given directory.
 *
 * @param {string} directory - The directory to delete backup files from.
 * @returns {Promise<void>}
 */
async function destroyer(directory) {
  const files = await readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = join(directory, file.name);

    if (file.isFile() && file.name.endsWith(".backup")) {
      console.log("Destroying:", fullPath);
      await unlink(fullPath);
    } else if (file.isDirectory()) {
      await destroyer(fullPath);
    }
  }
}

export default destroyer;
