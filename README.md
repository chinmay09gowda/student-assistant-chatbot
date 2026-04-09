Student Assistant Chatbot

An AI-powered study companion designed for Indian students up to 10th standard. It provides clear, syllabus-based answers in a simple and interactive manner, helping students learn more effectively in their daily studies.

Features

* Personalized Onboarding:-
Students can select their education board (CBSE, ICSE, State Board), class, and subject to receive tailored assistance.
* Subject-Specific Support
Dedicated AI assistance for Mathematics, Science, Social Studies, and Computers to ensure accurate and relevant explanations.
* Image and PDF Support
Upload images of notes or textbooks and get instant explanations
Ask questions directly from PDF documents such as assignments or textbooks
* Modern User Interface
Clean and responsive design with smooth navigation and well-structured, step-by-step answers.
* Visual Learning Support
Provides diagrams and visual references to improve understanding of concepts.
* Advanced AI Integration
Utilizes Groq, OpenAI, and Perplexity for fast and reliable responses.
Technology Stack

Frontend
React (Vite), CSS3, React Markdown

Backend
Node.js, Express, Tesseract.js (OCR), pdf-parse, AI SDKs

Getting Started
1. Clone the Repository
git clone https://github.com/chinmay09gowda/student-assistant-chatbot.git
cd student-assistant-chatbot

2. Backend Setup
    cd backend
    npm install

Create a .env file:

PORT=5000
GROQ_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

Run the backend server:

npm run dev


3. Frontend Setup
cd ../frontend
npm install
npm run dev


License

This project is open-source and available for contributions.

Developed to support students in achieving better understanding and academic performance.