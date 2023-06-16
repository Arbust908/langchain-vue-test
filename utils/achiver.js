import { writeFile, readFile, unlink, access } from "fs/promises";
import { join } from "path";

/**
 * Creates a backup of the original file and writes new content to the original file.
 *
 * @param {string} filePath - The path to the file.
 * @param {string} newContent - The new content for the file.
 * @returns {Promise<void>}
 */
async function archiver(filePath, newContent) {
  // Create a backup file with the original content
  const backupFilePath = `${filePath}.backup`;

  // Check if a file with the same backup name already exists
  try {
    await access(backupFilePath);
    throw new Error(`Backup file ${backupFilePath} already exists.`);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  // Read the original content of the file
  const originalContent = await readFile(filePath, "utf8");
  console.log(`Original content: ${originalContent}`);

  // Write the original content to the backup file
  await writeFile(backupFilePath, originalContent, "utf8");
  console.log(`Backup file ${backupFilePath} created.`);

  // Write the new content to the original file
  await writeFile(filePath, newContent, "utf8");
  console.log(`Original file ${filePath} updated.`);
}

export default archiver;
