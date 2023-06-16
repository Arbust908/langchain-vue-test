import archiver from "./achiver.js";
import crawler from "./crawler.js";
import destroyer from "./destroyer.js";
import { join, extname } from "path";
import { readdir, readFile } from "fs/promises";
import { vueExpert } from "../simon.js";

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
// const regex = /(?=.*<script)(?=.*setup)(?!.*setup\(\)).*$/g;
 */
  async function callback(path, fileName, content) {
    const ext = extname(fileName);
    if (ext === ".vue") {
      // Detect if the file contents uses the script setup syntax
      // '<script setup'
      // '<script lang="ts" setup'

      const isScriptSetup =
        content.includes("<script setup") ||
        content.includes('<script lang="ts" setup');
      if (isScriptSetup) {
        console.log(`${fileName} already contains a <script setup> block.`);
      } else {
        console.log(`Processing::`);
        console.log(`::${path}`);
        console.log(`::${fileName}`);
        console.log(`::${ext}`);
        try {
          const newName = fileName.replace(ext, "");
          const newContent = await vueExpert(content, newName);
          console.log("Saving new content...");
          await archiver(path, newContent);
        } catch (error) {
          console.error(`Failed::${fileName} => ${error}`);
        }
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
