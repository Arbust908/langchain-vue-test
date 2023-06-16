import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";

/**
 * Crawls the directory and its subdirectories, calling a callback with the file path, file name, and contents of each file.
 *
 * @param {string} directory - The directory to start crawling from.
 * @param {Function} callback - The callback to call with the file path, file name, and contents of each file.
 * @param {Object} options - The options for the crawl.
 * @param {string[]} options.allowedDirectories - The list of directories that are allowed to be crawled.
 * @param {string[]} options.disallowedDirectories - The list of directories that are disallowed to be crawled.
 * @param {string[]} options.allowedFiles - The list of files that are allowed to be read.
 * @param {string[]} options.disallowedFiles - The list of files that are disallowed to be read.
 * @param {string[]} options.allowedExtensions - The list of file extensions that are allowed.
 * @param {string[]} options.disallowedExtensions - The list of file extensions that are disallowed.
 * @param {number} options.fileLimit - The maximum number of files to process before stopping the crawl.
 * @returns {Promise<number>} The number of files processed.
 */
async function crawler(directory, callback, options = {}) {
  let count = 0;

  const {
    allowedDirectories = [],
    disallowedDirectories = [],
    allowedFiles = [],
    disallowedFiles = [],
    allowedExtensions = [],
    disallowedExtensions = [],
    fileLimit = Infinity,
  } = options;

  try {
    const files = await readdir(directory, {
      encoding: "utf8",
      withFileTypes: true,
    });
    for (const file of files) {
      if (count >= fileLimit) {
        break;
      }
      const fullPath = join(directory, file.name);

      if (file.isDirectory()) {
        console.log(`<>::${file.name}`);
        if (
          disallowedDirectories.includes(file.name) ||
          (allowedDirectories.length > 0 &&
            !allowedDirectories.includes(file.name))
        )
          continue;
        count += await crawler(fullPath, callback, options);
      } else if (file.isFile()) {
        let ext = "";
        try {
          ext = extname(file.name);
        } catch (err) {
          console.error(`Failed to get extension of file ${file.name}: ${err}`);
        }
        if (
          disallowedFiles.includes(file.name) ||
          (allowedFiles.length > 0 && !allowedFiles.includes(file.name)) ||
          disallowedExtensions.includes(ext) ||
          (allowedExtensions.length > 0 && !allowedExtensions.includes(ext))
        )
          continue;

        const contents = await readFile(fullPath, "utf8");
        await callback(fullPath, file.name, contents);
        count++;
      }
    }
  } catch (err) {
    console.error(`Failed to list contents of directory ${directory}: ${err}`);
  }
  return count;
}

export default crawler;
