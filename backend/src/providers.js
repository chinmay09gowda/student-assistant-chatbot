import 'dotenv/config';
import OpenAI from 'openai';
import Groq from 'groq-sdk';

export async function chatWithProvider(messages) {
  const provider = process.env.PROVIDER || 'mock';

  switch (provider) {
    case 'groq': {
      const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const resp = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
      });
      return resp.choices[0]?.message?.content || "The AI (Groq) returned an empty response.";
    }

    case 'openai': {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const resp = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });
      return resp.choices[0]?.message?.content || "The AI (OpenAI) returned an empty response.";
    }

    case 'perplexity': {
      const resp = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3-sonar-small-32k-chat",
          messages,
        }),
      });
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || "No response";
    }

    case 'mock':
    default:
      return "This is a mock response (set PROVIDER to openai, groq, or perplexity in .env)";
  }
}
