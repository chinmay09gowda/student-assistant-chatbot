# Comprehensive Project Report: Student Assistant Chatbot

## 1. Project Overview
The **Student Assistant Chatbot** is a full-stack, AI-powered educational platform designed specifically for the Indian K-12 ecosystem (up to 10th grade). The project aims to bridge the gap between complex AI capabilities and simplified, syllabus-aligned learning for students across various educational boards (CBSE, ICSE, and State Boards).

### Objectives:
- Provide accurate, subject-specific academic assistance.
- Enable multi-modal interaction via Image and PDF analysis.
- Maintain strict academic boundaries through specialized AI system prompts.
- Deliver an intuitive, distraction-free user interface.

---

## 2. Core Features

### 2.1 Personalized Onboarding
The system implements a structured multi-step setup process where students select their:
- **Educational Board**: CBSE, ICSE, or State Board.
- **Academic Grade**: 6th through 10th.
- **Specialization**: Mathematics, Science, Social Studies, Computers, English, or General.
This context is injected into every AI interaction to ensure responses are age-appropriate and curriculum-aligned.

### 2.2 Multi-Modal AI Analysis
The platform supports more than just text input:
- **OCR Integration**: Utilizing **Tesseract.js**, the bot can read handwritten notes or textbook photos.
- **PDF Parsing**: Utilizing **pdf-parse**, the system extracts text from assignments or e-books to answer specific queries about the document.

### 2.3 Visual Learning Support (Dynamic Diagrams)
A specialized "Diagram Handler" identifies when a student needs a visual aid. It dynamically generates or fetches relevant scientific and mathematical diagrams using a combination of descriptive prompts and external image APIs (Bing Search Integration).

### 2.4 Modern Academic Design
The UI follows a professional "Academic Slate & Orange" theme, featuring:
- **Responsive Layout**: Seamless experience on laptops and tablets.
- **Markdown Rendering**: High-fidelity rendering of formulas, lists, and code snippets.
- **State-based Progress**: A unique 3D cube preloader to manage initial asset loading.

---

## 3. Technical Architecture

### 3.1 Frontend (The Interactive Layer)
- **Framework**: React.js with Vite for high-performance builds.
- **Logic**: Built-in state management for the onboarding flow and persistent chat history.
- **Rendering**: `react-markdown` for AI responses and custom components for image previews.
- **Communication**: Axios/Fetch-based service layer (`services/api.js`) interacting with the Express backend.

### 3.2 Backend (The Intelligence Layer)
- **Runtime**: Node.js with the Express framework.
- **Architecture**: Follows a **Controller-Service pattern** for scalability and maintenance.
- **Logic Modules**:
  - `chatController.js`: Manages AI context, file processing logic, and prompt engineering.
  - `providers.js`: A specialized abstraction layer that allows the bot to switch between AI providers (Groq, OpenAI, Perplexity) based on environmental configuration.
- **Security**: CORS-restricted access and environment-driven configuration via `dotenv`.

### 3.3 AI Stack
- **Models**: Optimized for **Llama 3.3 (Groq)** for speed and **GPT-4o mini** for complex reasoning.
- **System Prompting**: Employs "Chain-of-Thought" prompting to ensure the AI remains in "strict tutor mode," refusing to answer non-academic queries.

---

## 4. Implementation Details

### File Structure Cleanup
The project underwent a professional structural audit where:
- Logic was separated from routing (Controllers).
- API calls were separated from UI (Services).
- Redundant and unused code snippets were purged to optimize package size.
- A robust ESLint configuration (v9 Flat Config) was implemented to ensure code quality.

### Deployment Strategy
- **Frontend**: Deployed on **Vercel** for edge-network performance.
- **Backend**: Hosted on **Render**, utilizing disk storage for temporary OCR file handling.

---

## 5. Summary of Achievements
- **Structure**: High-standard, professional file hierarchy.
- **Quality**: 0 Linting errors; fully validated `prop-types`.
- **Performance**: Optimized build size and efficient multi-modal handling.
- **Documentation**: Comprehensive README and Technical Reports available for stakeholders.

---
**Developed by**: Chinmay Gowda  
**Status**: Production Ready  
**URL**: [https://student-assistant-chatbot.vercel.app](https://student-assistant-chatbot.vercel.app)
