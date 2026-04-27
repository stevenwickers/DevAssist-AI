# DevAssist AI Presentation Script

Target length: 10 to 15 minutes. You can shorten it by skipping the optional notes in each section.

## Pre-Demo Checklist

- Run the app from the repo root with `npm run dev`.
- Confirm the web app is available at `http://localhost:3000`.
- Confirm Swagger is available at `http://localhost:5000/swagger`.
- Confirm `apps/api/.env` has `OPENAI_API_KEY` set.
- Confirm `apps/web/.env` points `VITE_API_URL` to the running API server. The API default is `http://localhost:5000`.

## 0:00-1:00 - Opening And Project Overview

"Today I am going to walk through DevAssist AI, which is a small TypeScript monorepo that demonstrates practical AI features in a web application.

The project has two main apps. The frontend lives in `apps/web`, and it is built with Vite, React, TypeScript, TanStack Router, Tailwind CSS, and shadcn-style components. The backend lives in `apps/api`, and it is an Express API that receives AI prompts from the frontend and forwards them to OpenAI.

The app demonstrates three user-facing workflows: Smart Summarizer, Code Explainer, and Portfolio Chat. Each workflow can run in two modes. In mock mode, the frontend uses local demo responses. In API mode, it calls the Express API, which then calls OpenAI."

Show:
- `README.md`
- `package.json`
- App running in browser at `http://localhost:3000`

## 1:00-2:15 - Monorepo And App Structure

"At the root level, this is an npm workspace. The root `package.json` defines scripts that run both applications together, or run each one separately.

The `npm run dev` script calls `scripts/dev.mjs`, which starts the API and the web app in parallel. That is convenient for demos because I can run one command and get both halves of the application.

The important folders are `apps/api/src` and `apps/web/src`. The API side is small on purpose: app setup, server startup, OpenAI config, Swagger config, middleware, and the AI route. The web side is organized by feature, so each AI workflow keeps its page, API adapter, mock data, components, and types close together."

Show:
- `package.json`
- `scripts/dev.mjs`
- Folder tree in editor

Optional talking point:
"This structure keeps the demo easy to explain: one shared backend endpoint handles AI requests, while each frontend feature owns the prompt it wants to send."

## 2:15-4:30 - API Code And OpenAI Call

"Now I will show the backend path. The Express app is created in `apps/api/src/app.ts`. It enables CORS, parses JSON request bodies, exposes Swagger at `/swagger`, and mounts the AI router at `/ai`.

The server entry point is `apps/api/src/server.ts`. It imports the Express app and listens on the port from the `PORT` environment variable, defaulting to `5000`.

The OpenAI API key is read in `apps/api/src/config/openai.ts` from `OPENAI_API_KEY`. That means the key stays on the server. The browser never receives the OpenAI key directly.

The main route is `apps/api/src/routes/ai.ts`. This file defines `POST /ai/ask`. It validates that the request has a non-empty string prompt, trims the input, checks the max prompt length, applies rate limiting, and then calls OpenAI using the OpenAI SDK."

Show:
- `apps/api/src/app.ts`
- `apps/api/src/server.ts`
- `apps/api/src/config/openai.ts`
- `apps/api/src/routes/ai.ts`

Key code to point at:

```ts
const openai = new OpenAI({
  apiKey: openaiApiKey,
})
```

```ts
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: trimmedPrompt }],
})

res.json({ reply: completion.choices[0].message.content })
```

Say:
"This is the core API call. The backend receives a plain prompt from the frontend, passes that prompt to the model as a user message, and returns only the generated text as `{ reply }`. The frontend features build different prompts, but they all share this one backend endpoint."

Optional talking point:
"There are a few practical safeguards here too: body size limits in Express, prompt length validation, and rate limiting. These are small but important controls when exposing an AI endpoint."

## 4:30-5:30 - Swagger API Demo

"Before switching to the frontend, I can also show the API contract in Swagger. The Swagger docs are generated from comments in the route file and served by the Express app.

Here, `POST /ai/ask` expects a JSON body with a `prompt` field. If the request is valid, it returns a JSON response with a `reply` field."

Show:
- Browser: `http://localhost:5000/swagger`
- Expand `POST /ai/ask`
- Try a simple request:

```json
{
  "prompt": "Explain React hooks in one paragraph."
}
```

Say:
"This is useful because it proves the backend can work independently from the React app. If something goes wrong in the frontend, Swagger gives me a quick way to verify whether the API itself is healthy."

## 5:30-7:30 - Web Routing And Layout

"On the frontend, the app starts in `apps/web/src/main.tsx`, then uses TanStack Router for navigation.

The root route is `apps/web/src/routes/__root.tsx`. It wraps every page in `AppShell`, which gives the app its shared navigation and layout. Individual routes live in `apps/web/src/routes`. The home route points to `HomePage`, the summarizer route points to `SummarizerPage`, the code explainer route points to `CodeExplainerPage`, and the portfolio chat route points to `PortfolioChatPage`.

The navigation items are defined in `apps/web/src/components/layouts/app-nav-items.ts`. That keeps the sidebar and feature list driven from the same route metadata."

Show:
- `apps/web/src/main.tsx`
- `apps/web/src/routes/__root.tsx`
- `apps/web/src/routes/index.ts`
- `apps/web/src/routes/summarizer/index.ts`
- `apps/web/src/routes/code-explainer/index.tsx`
- `apps/web/src/routes/portfolio-chat/index.tsx`
- `apps/web/src/components/layouts/app-nav-items.ts`

Say:
"This makes the app feel like one coherent product even though each feature is implemented separately."

## 7:30-9:30 - Web API Calls And Mock Data

"The frontend has a shared API helper at `apps/web/src/features/ai/ask-api.ts`. This function reads `VITE_API_URL`, sends a `POST` request to `/ai/ask`, checks for errors, parses the JSON response, and returns the reply string.

There is also a helper called `parseJsonReply`. Some features ask OpenAI to return JSON, and this helper strips a JSON code fence if the model includes one, then parses the reply.

Each feature has two data paths: a live API path and a mock path. For example, the Summarizer page chooses between `summarizeText` and `summarizeTextMock`. Code Explainer chooses between `explainCode` and `explainCodeMock`. Portfolio Chat chooses between `sendPortfolioChat` and `sendPortfolioChatMock`."

Show:
- `apps/web/src/features/ai/ask-api.ts`
- `apps/web/src/features/summarizer/pages/SummarizerPage.tsx`
- `apps/web/src/features/summarizer/api/summarize-api.ts`
- `apps/web/src/features/summarizer/mock.ts`
- `apps/web/src/features/code-explainer/api/explain-code-api.ts`
- `apps/web/src/features/code-explainer/mock.ts`
- `apps/web/src/features/portfolio-chat/api/portfolio-chat-api.ts`
- `apps/web/src/features/portfolio-chat/mock.ts`

Key code to point at:

```ts
const summarize = useApi ? summarizeText : summarizeTextMock
const response = await summarize({ text, tone })
```

```ts
const getExplanation = useApi ? explainCode : explainCodeMock
const response = await getExplanation({ code, language })
```

```ts
const sendMessage = useApi ? sendPortfolioChat : sendPortfolioChatMock
```

Say:
"The nice thing about this pattern is that the page does not need to know much about where data comes from. It just asks for a result. The selected data source decides whether that result comes from local mock logic or the live API."

## 9:30-10:45 - Data Source Toggle

"The mock/API switch is handled globally through a React context in `apps/web/src/features/data-source`. The provider stores the selected mode in local storage under `devassist-ai-data-source`, so if I refresh the page the selected mode stays the same.

The visible toggle is `DataSourceToggle`. When the app is in mock mode, the pages use local demo responses. When it is in API mode, the pages use the real API adapters."

Show:
- `apps/web/src/features/data-source/DataSourceProvider.tsx`
- `apps/web/src/features/data-source/DataSourceToggle.tsx`
- Browser navigation toggle

Say:
"This is especially helpful during development and presentations. I can demo the full UI without an API key by staying in mock mode, then switch to API mode to show the real OpenAI integration."

## 10:45-13:30 - Live App Demo

Start in mock mode.

"First I will show mock mode. This proves the UI flow works without depending on a network call or an API key."

Demo 1: Smart Summarizer
- Open `Summarizer`.
- Paste a short paragraph or meeting notes.
- Choose a tone.
- Click `Summarize`.
- Point out summary, key takeaways, and action items.

Say:
"In mock mode, this response comes from `apps/web/src/features/summarizer/mock.ts`. It waits briefly to simulate loading, then returns a predictable response shaped exactly like the real feature expects."

Demo 2: Code Explainer
- Open `Code Explainer`.
- Paste a small TypeScript or JavaScript function.
- Select the language.
- Run the explanation.

Sample code:

```ts
function getCompletedTasks(tasks: { title: string; done: boolean }[]) {
  return tasks.filter((task) => task.done).map((task) => task.title)
}
```

Say:
"The Code Explainer uses the same pattern: page state, submit handler, data-source choice, then results rendered in a structured UI."

Demo 3: Portfolio Chat
- Open `Portfolio Chat`.
- Ask: `What kinds of AI and frontend work does Steven demonstrate here?`
- Show the response and source labels.

Say:
"In mock mode, Portfolio Chat returns portfolio-style content and sample sources. A future version could connect this to a real document index or retrieval-augmented generation pipeline."

Switch to API mode.

"Now I will switch to API calls. The UI stays the same, but the functions behind the pages now call the Express API, and the Express API calls OpenAI."

Repeat one fast demo:
- Use Summarizer or Code Explainer.
- Submit the same input.
- Point out the loading state and different response.

Say:
"At this point, the frontend calls `askAi`, `askAi` posts to `/ai/ask`, the backend route calls OpenAI, and the response comes back through the same component tree."

## 13:30-14:30 - Architecture Summary

"To summarize the architecture: the frontend owns the user experience and feature-specific prompting. The backend owns the OpenAI credential, input validation, rate limiting, and the actual OpenAI SDK call.

Mock data is intentionally built into each feature so the app remains demoable and testable even when the API is unavailable. API mode demonstrates the real integration. Both paths return the same TypeScript response shapes, which keeps the UI code clean."

Show:
- Browser app
- `apps/web/src/features/ai/ask-api.ts`
- `apps/api/src/routes/ai.ts`

## 14:30-15:00 - Closing

"DevAssist AI is a compact example of how to build an AI-enabled application without overcomplicating the architecture. It shows a React frontend, feature-level prompts, reusable API helpers, mock data for reliable demos, and an Express backend that safely proxies calls to OpenAI.

The main takeaway is that the application separates concerns cleanly: the UI decides what experience to provide, the feature layer decides what prompt to send, and the API layer handles secure communication with OpenAI."

## Shorter 5-7 Minute Version

Use this order if time is tight:

1. Project overview: `apps/web` and `apps/api`.
2. Show `apps/api/src/routes/ai.ts` and the OpenAI call.
3. Show Swagger and one `POST /ai/ask` example.
4. Show `apps/web/src/features/ai/ask-api.ts`.
5. Show one feature page, one feature API file, and one mock file.
6. Demo mock mode.
7. Switch to API mode and demo one live request.
8. Close with the architecture summary.

