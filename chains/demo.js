import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

import dotenv from "dotenv";
dotenv.config();

const baseTemplate = "What would be an exotic name for a {thing}?";
const promptTemplate = new PromptTemplate({
  template: baseTemplate,
  inputVariables: ["thing"],
});

const model = new OpenAI({
  temperature: 0.9,
});

const chain = new LLMChain({
  llm: model,
  prompt: promptTemplate,
});

const response = await chain.call({
  thing: "mystical element that flows through the universe",
});
console.log(response);

// This comment was added by the crawler
// This comment was added by the crawler with archiver
// This comment was added by the crawler with archiver