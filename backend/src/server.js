import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
// Fix for potential ESM/CJS interop issues
const parsePdf = typeof pdf === "function" ? pdf : pdf.default;
const Tesseract = require("tesseract.js");
import fs from "fs";
import { chatWithProvider } from "./providers.js";

dotenv.config();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });
const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.post("/api/chat", upload.single("file"), async (req, res) => {
  try {
    const { messages: messagesStr, context } = req.body;
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
        * NO INTRODUCTORY TEXT.
        * NO EXPLANATORY TEXT.
        * NO BULLET POINTS.
        * FORMAT: ![diagram](https://image.pollinations.ai/prompt/{search_term}?nologo=true)
        * Replace {search_term} with a detailed, URL-encoded prompt.
      
      - FOR ALL OTHER QUERIES:
        * Format your response in clear point-wise bullet points using Markdown.
        * Be extremely concise and direct.
        * Do not volunteer unrequested extra paragraph information.`
    };

    if (extractedText) {
      const truncatedText = extractedText.substring(0, 10000); // Prevent context overflow
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        lastMessage.content = `[ATTACHED FILE CONTENT]: ${truncatedText}\n\n[USER QUESTION]: ${lastMessage.content}`;
      }
    }

    const messagesWithContext = [systemPrompt, ...messages];
    let reply = await chatWithProvider(messagesWithContext);

    // FORCE "ONLY DIAGRAM" RULE: if user asked for diagram/image, strip any leaked text or force image if missing
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
    // Broad regex for "diagram" or "image" including common typos
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
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`[backend] listening on http://localhost:${PORT}`));
