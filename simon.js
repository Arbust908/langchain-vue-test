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
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

// Function to read a Markdown file and return its content as a string
function importMarkdownFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error(`Error reading Markdown file: ${error}`);
    return null;
  }
}

// Usage example
const markdownFilePath = "./script_setup_doc-list.md";
const script_setup_doc = importMarkdownFile(markdownFilePath);
const vue_to_migrate = importMarkdownFile("./test-scsp.vue");

const model = new OpenAI({
  modelName: "gpt-3.5-turbo-16k-0613",
  temperature: 0.7,
});
const memory = new BufferMemory({ size: 10 });
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

const script_to_convert = `As a Vue 3 Expert,follow the steps convert the code block to use the script setup syntax.\n
  ${script_setup_doc} 
  \n ${vue_to_migrate}
  \n\n
  Remember tu return the new vue SFC`;
const resp_2 = await chain.call({
  input: script_to_convert,
});

console.log(resp_2);
fs.writeFileSync("./test-scsp_2.vue", resp_2.response);

const input_3 = `As a vue 3 expert check if the following SFC is correct \n\n ${resp_2.response} \n\n remember the 5 steps \n
1. Specify the Language and Setup Syntax: Start by specifying that you're using JavaScript and the setup syntax in your script tag \n 
2. Move props and context to defineProps() and defineContext(): In a regular Composition API setup, the props and context are available as arguments to the setup() function. In the script setup format, you get props and context through the defineProps() and defineContext() functions. use an interface to define the props type. Use withDefaults for default prop values: If you have props with default values, you would use the withDefaults method:
3. Remove the setup() function: In the script setup format, there is no need for a setup() function. Instead, you directly write your Composition API code inside the <script> tag.
4. Handle emits: If you need to use context.emit, you will use the defineEmits() function. This also serves as an opportunity to validate the event types.
5. remove the setup() return statement: In the script setup format, there is no need for a return statement. Instead, you directly write your Composition API code inside the <script> tag. \n\n
Remember tu return the new vue SFC.`;

const resp_3 = await chain.call({
  input: input_3,
});

console.log(resp_3);
fs.writeFileSync("./test-scsp_3.vue", resp_3.response);
