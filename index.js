// a basic server using express
import { OpenAI } from "langchain/llms/openai";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3033;

app.get("/", async (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

// /api/prompt should use POST to send data to OpenAI via langchain
app.post("/api/prompt", async (req, res) => {
  const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9,
  });

  const { prompt } = req.body;
  const respond = await model.call(prompt);

  res.send(respond);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// This comment was added by the crawler
// This comment was added by the crawler with archiver
// This comment was added by the crawler with archiver