import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { ChatAgent, AgentExecutor } from "langchain/agents";

import dotenv from "dotenv";
dotenv.config();

const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, { hl: "en", gl: "us" }),
];
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.5,
});

const agent = ChatAgent.fromLLMAndTools(model, tools);

const executor = AgentExecutor.fromAgentAndTools({
  agent: agent,
  tools: tools,
});

const res = await executor.run("How many people live in argentina in 2023?");
console.log(res);

// This comment was added by the crawler
// This comment was added by the crawler with archiver
// This comment was added by the crawler with archiver