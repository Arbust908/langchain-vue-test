import { OpenAI } from "langchain/llms/openai";

import dotenv from "dotenv";
dotenv.config();

console.log("Streaming example");
console.log("----------~----------");
console.log();

const model = new OpenAI({
  streaming: true,
  callbacks: [
    {
      handleLLMNewToken(token) {
        process.stdout.write(token);
      },
    },
  ],
});
console.log("Streaming model initialized.");
console.log();
await model.call("Write a short description for an RPG character.");
