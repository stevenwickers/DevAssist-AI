# DevAssist AI UI Demo Script

Target length: 2 to 5 minutes

Focus: Start with the RAG experience in Portfolio Chat, then briefly cover the other AI pages.

## Quick Setup

- Run the app with `npm run dev`
- Open the UI at `http://localhost:3000`
- Start in `Mock data` if you want a safer demo, or switch to `API calls` if you want to show the live backend

## Suggested Demo Flow

1. Home
2. Portfolio Chat
3. Summarizer
4. Code Explainer

## Script

"Today I’m going to focus on the UI side of DevAssist AI. This app is designed as a lightweight AI toolkit, and the most important experience here is the Portfolio Chat page, because that is where the retrieval-based assistant lives."

"Starting on the home page, you can see the app is organized into three main AI experiences: Summarizer, Code Explainer, and Portfolio Chat. The layout is simple and intentional, with shared navigation on the left, a global data mode toggle, and dedicated pages for each workflow."

"The first page I want to highlight is Portfolio Chat, because this is the biggest and most important part of the UI. Instead of a generic chatbot, this page is designed to feel like a grounded assistant. The user enters a question about projects, architecture, frontend work, backend APIs, or technical strengths, and the interface presents the conversation in a clear chat format."

"What makes this page especially important is the way the UI supports retrieval-augmented generation. The goal is not just to return an answer, but to return an answer that is tied back to portfolio content. You can see that in the message layout, where assistant responses can include source badges. That gives the user more confidence that the answer is based on actual portfolio material instead of a vague generated response."

"From a user experience standpoint, this page is doing a few important things well. It opens with a clear prompt, it keeps the conversation history visible, it shows loading feedback while the assistant is thinking, and it allows the user to reset the chat easily. So even though the retrieval logic is happening behind the scenes, the UI makes that experience feel guided, transparent, and trustworthy."

"If I were demoing this live, I would ask something like, 'What kinds of AI and frontend work does Steven demonstrate here?' Then I would point out not only the answer itself, but also the source labels underneath it. That is the key UI moment on this project, because it shows that this is meant to be a grounded assistant experience rather than just a standard chat box."

"After that, the second page is the Smart Summarizer. This page is more of a structured productivity workflow. On the left, the user pastes in long-form text such as meeting notes, transcripts, or article content. They can also choose the tone, like professional, concise, or friendly. On the right, the results are broken into three sections: the summary, key takeaways, and action items."

"What I like about this UI is that it makes the output immediately usable. It is not just one large block of generated text. It is organized into pieces that are easier to scan, easier to present, and easier to copy into other work."

"The third page is Code Explainer. This page is built for developers who want a quick, plain-English breakdown of a code snippet. The user pastes in code, selects the language, and gets back an overview, a step-by-step explanation, important concepts, and possible improvements. So again, the UI is taking an AI response and shaping it into a more structured, practical format."

"Across all three pages, the UI stays consistent. The navigation is shared, the cards and forms follow the same design language, and the data toggle lets me switch between mock responses and live API responses without changing the flow of the experience. That consistency makes the app feel like one product instead of three disconnected demos."

"If I had to summarize the UI in one sentence, I’d say this project is about turning AI into focused, usable experiences, with Portfolio Chat and its RAG-driven, source-backed interface as the centerpiece."

## Shorter 2-Minute Version

"This UI is a small AI toolkit with three experiences: Portfolio Chat, Summarizer, and Code Explainer. The most important page is Portfolio Chat, because it represents the retrieval-augmented generation part of the app."

"On that page, the user asks questions about projects, technical strengths, or architecture, and the assistant responds in a chat layout with source badges attached to the answer. That is the key UI value: it is not just generating text, it is showing grounded responses tied to portfolio context."

"The Summarizer page is a structured text workflow where users paste in content, choose a tone, and get back a summary, takeaways, and action items. The Code Explainer page does something similar for developers by turning a code snippet into a clear explanation, concepts list, and suggested improvements."

"Overall, the UI keeps the experience simple and consistent, but the standout piece is the RAG-based Portfolio Chat because it gives the app the strongest real-world value and the clearest trust signal for users."

## Demo Prompts

- Portfolio Chat: `What kinds of AI and frontend work does Steven demonstrate here?`
- Portfolio Chat: `What backend API experience is highlighted in this portfolio?`
- Summarizer: paste meeting notes or a project update
- Code Explainer: use the built-in `Load Example` button for a quick demo

