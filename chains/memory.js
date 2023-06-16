import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

import dotenv from "dotenv";
dotenv.config();

const model = new OpenAI({});
const memory = new BufferMemory({ size: 10 });
const chain = new ConversationChain({
  llm: model,
  memory: memory,
});

const resp_1 = await chain.call({
  input:
    "Hi, my name is Fran and I'm an Argentinian developer with 3 cute cats.",
});

console.log(resp_1);

const resp_2 = await chain.call({
  input: "Do you remember my name? and where I'm from? and am I a dog person?",
});

console.log(resp_2);

// This comment was added by the crawler
// This comment was added by the crawler with archiver
// This comment was added by the crawler with archiver
