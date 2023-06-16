import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

import dotenv from "dotenv";
dotenv.config();

const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. If the assistant doesn't know the answer, it will ask you for more information."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const model = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo",
});

const chain = new ConversationChain({
  memory: new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
  }),
  prompt: chatPrompt,
  llm: model,
});

const res = await chain.call({
  input: "Hello from Argentina",
});

console.log(res);

const res2 = await chain.call({
  input: "My name is Agustin, but friends call my Agus",
});
console.log(res2);
const res3 = await chain.call({
  input: "Do you know what is the capital of my country?",
});
console.log(res3);

// This comment was added by the crawler
// This comment was added by the crawler with archiver
// This comment was added by the crawler with archiver