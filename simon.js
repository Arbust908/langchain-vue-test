/* import { OpenAI } from "langchain/llms/openai";
import { SerpAPI } from "langchain/tools";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

import dotenv from "dotenv";
dotenv.config(); */

/* const model = new OpenAI({});
const memory = new BufferMemory({ size: 10 });
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, { hl: "en", gl: "us" }),
];
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});
const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true,
}); */

import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { writeFile, readFile, access } from "fs/promises";
import dotenv from "dotenv";
dotenv.config();

// Function to read a Markdown file and return its content as a string
async function importMarkdownFile(filePath) {
  try {
    const fileContent = await readFile(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error(`Error reading Markdown file: ${error}`);
    return null;
  }
}

const script_setup_doc = await importMarkdownFile("./script_setup_doc-list.md");
/* const vue_to_migrate = importMarkdownFile("./test-scsp.vue"); */

const model = new OpenAI({
  modelName: "gpt-3.5-turbo-16k-0613",
  temperature: 0,
});
const memory = new BufferMemory({ size: 10 });
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

export const vueExpert = async (vue_to_migrate, file_name = "option") => {
  console.log("vueExpert::" + vue_to_migrate.length);
  console.log(file_name);

  const script_to_convert = `As a Vue 3 Expert, use the following steps to migrate the Single File Component (SFC) to use the script setup syntax.
    \n${script_setup_doc}
    \n code to migrate:
    \n ${vue_to_migrate}
    \n Only return the new vue SFC with no comments or extra text.`;
  const responseOne = await chain
    .call({
      input: script_to_convert,
    })
    .catch((err) => {
      console.log(err);
    });
  await writeFile(`./example/${file_name}_1.vue`, responseOne.response);

  // get the response and extract the vue SFC between ``` and ``` and return it. Remember to remove the file type from the first ```.
  const sfc = responseOne.response.replace("```vue", "```").split("```");
  console.log(sfc.length);
  const finalSFC = sfc.length === 1 ? sfc[0] : sfc[1];
  await writeFile(`./example/${file_name}_sfc.vue`, JSON.stringify(finalSFC));
  const AI_Signature = `/* migrated by simon.js by Fran ;P */`;
  // Remove white space from the beginning of the string
  // add the AI signature in the line before the last </script>

  return finalSFC
    .replace(/^\s+/g, "")
    .replace("</script>", `${AI_Signature}\n</script>`);
};
