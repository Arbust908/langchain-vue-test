import archiver from "./achiver.js";
import crawler from "./crawler.js";
import destroyer from "./destroyer.js";
import { join, extname } from "path";
import { readdir, readFile } from "fs/promises";

const start = async () => {
  console.log("Starting the server...");
  // const startDirectory = "./"; // Edit this as needed
  const startDirectory = "/Users/fran/Documents/demandio/simplycodes-admin/src"; // Edit this as needed

  const options = {
    disallowedDirectories: ["node_modules"],
  };

  /**
 * Callback function that is called with the file pathI apologize for the incomplete response earlier. Let's add the callback function with proper JSDoc comments:

```javascript
/**
 * Callback function that is called with the file path, file name, and contents of the file.
 *
 * @param {string} path - The path of the file.
 * @param {string} fileName - The name of the file.
 * @param {string} content - The content of the file.
 * @returns {Promise<void>}
 */
  async function callback(path, fileName, content) {
    // Do something with the file path, name, and content.
    console.log(`Processing ${path}`);
    const ext = extname(fileName);
    console.log(`File extension: ${ext}`);
    if (ext === ".vue") {
      // Check if the file contains the words 'script' and 'setup' between "<" ">".
      // if it does return true.
      const regex = /<script.*setup.*>/gs;
      const match = regex.test(content);
      console.log(`Match: ${match}`);
      if (match) {
        console.log(`File ${path} already contains a <script setup> block.`);
      } else {
        // Add a comment to the file.
        const newContent =
          content + "\n// This file already contains a <script setup> block.";
        await archiver(path, newContent);
      }
    }
  }
  await destroyer(startDirectory).catch((err) =>
    console.error(`Failed to delete backup files: ${err}`)
  );
  console.log("Backup files deleted.");
  // Start the crawl from the current directory
  const count = await crawler(startDirectory, callback, options).catch((err) =>
    console.error(`Failed to crawl directory: ${err}`)
  );
  console.log(`Processed ${count} file(s)`);
};

await start();
