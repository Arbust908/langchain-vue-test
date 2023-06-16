import { OpenAI } from "langchain/llms/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

import dotenv from "dotenv";
dotenv.config();

const model = new OpenAI({
  temperature: 0,
});

const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, { hl: "en", gl: "us" }),
  new Calculator(),
];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true,
});
console.log("Agent executor initialized.");

const response = await executor.call({
  input:
    "who is Nicky Nicole's boyfriend? What is his age to the power of 0.346?",
});

console.log(response.output);
