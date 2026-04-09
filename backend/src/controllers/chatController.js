import fs from "fs";
import { chatWithProvider } from "../providers.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
const parsePdf = typeof pdf === "function" ? pdf : pdf.default;
const Tesseract = require("tesseract.js");

export const handleChat = async (req, res) => {
  try {
    const { messages: messagesStr } = req.body;
    const messages = JSON.parse(messagesStr || "[]");
    let extractedText = "";

    if (req.file) {
      const filePath = req.file.path;
      const mimeType = req.file.mimetype;

      if (mimeType.includes("pdf")) {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await parsePdf(dataBuffer);
        extractedText = data.text;
      } else if (mimeType.includes("image")) {
        const result = await Tesseract.recognize(filePath, "eng");
        extractedText = result.data.text;
      }

      // Cleanup
      fs.unlinkSync(filePath);
    }

    const systemPrompt = {
      role: "system",
      content: `You are a strict and helpful student AI assistant.
      
      ### UNIVERSAL RULES
      1. Adapt curriculum to perfectly match the specified Board and Grade.
      2. If the subject is 'GENERAL' or 'OTHER', you are a versatile educational assistant and can discuss any intellectual topic.
      3. For specific subjects (Science, Math, etc.), strictly stay within that subject.
      
      ### RESPONSE FORMATTING (CRITICAL)
      - IF the user asks for a 'diagram', 'image', or 'picture':
        * Your response MUST contain ONLY the markdown image code.
        * FORMAT: ![diagram](https://image.pollinations.ai/prompt/{search_term}?nologo=true)
        * Replace {search_term} with a detailed, URL-encoded prompt.
      
      - FOR ALL OTHER QUERIES:
        * Format your response in clear point-wise bullet points using Markdown.
        * Be extremely concise and direct.`
    };

    if (extractedText) {
      const truncatedText = extractedText.substring(0, 10000);
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        lastMessage.content = `[ATTACHED FILE CONTENT]: ${truncatedText}\n\n[USER QUESTION]: ${lastMessage.content}`;
      }
    }

    const messagesWithContext = [systemPrompt, ...messages];
    let reply = await chatWithProvider(messagesWithContext);

    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const isDiagramRequest = /diagram|diagran|imag|pictur|photo|draw|icon/i.test(lastUserMsg);

    if (isDiagramRequest) {
      const subjectTerm = lastUserMsg.replace(/\[.*?\]/g, "").replace(/diagram|image|picture|give|me|a|of|diagran/gi, "").trim() || "educational diagram";
      const searchTerm = encodeURIComponent(subjectTerm + " scientific diagram educational");
      
      const img1 = `![Diagram](https://tse1.mm.bing.net/th?q=${searchTerm}&pid=Api&mkt=en-US&adlt=on)`;
      
      reply = `### Educational Diagram for: ${subjectTerm.toUpperCase()}\n\n` + 
              `${img1}\n\n` +
              `*View more results on [Google Images](https://www.google.com/search?q=${searchTerm}&tbm=isch)*`;
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};
