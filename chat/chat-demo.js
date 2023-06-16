import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import dotenv from "dotenv";
dotenv.config();

console.log("setting up prompt");
const translationPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "You are a teacher, you'll translate all {input_lang} to {output_lang}"
  ),
  HumanMessagePromptTemplate.fromTemplate("{text}"),
]);
console.log("setting up prompt value");
const finalPrompt = await translationPrompt.formatPromptValue({
  input_lang: "english",
  output_lang: "spanish",
  text: "The necromancer is a good old wizard called Agust",
});
console.log(finalPrompt);
console.log("setting up model");
const model = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo",
});

/* const res = await model.generatePrompt([finalPrompt]);

console.log(res.generations); */

const chain = new LLMChain({
  llm: model,
  prompt: translationPrompt,
});

const res = await chain.call({
  input_lang: "english",
  output_lang: "spanish",
  text: "The necromancer is a good old wizard called Agust",
});

console.log(res);

console.log("setting up chat");
/* const chat = new ChatOpenAI({
  temperature: 0.9,
  modelName: "gpt-3.5-turbo",
});

const res = await chat.generate([
  [
    new SystemChatMessage(
      "You are a Spanish teacher, you'll translate all english to spanish"
    ),
    new HumanChatMessage("The necromancer is a good old wizard called Agust"),
  ],
  [
    new SystemChatMessage(
      "You are a Greek teacher, you'll translate all english to latin"
    ),
    new HumanChatMessage("The necromancer is a good old wizard called Agust"),
  ],
]);

console.log(res.generations);
 */

// This comment was added by the crawler
// This comment was added by the crawler with archiver
// This comment was added by the crawler with archiver