# DevAssist AI

DevAssist AI is a TypeScript monorepo for a small AI developer toolkit. It includes a Vite React frontend, an Express API, OpenAI integration, Swagger docs, mock data mode, API mode, and light/dark theme support.

## Apps

- `apps/web`: React app for the AI tools and UI.
- `apps/api`: Express API that proxies AI requests to OpenAI and exposes Swagger documentation.

## Features

- **Smart Summarizer**: Paste long-form text and generate a summary, key takeaways, and action items.
- **Code Explainer**: Paste code and get a plain-English explanation, step-by-step notes, important concepts, and improvement ideas.
- **Portfolio Chat**: Ask portfolio-focused questions and get an assistant-style response.
- **Mock/API toggle**: Toggle between local mock responses and real API calls from the app navigation.
- **Theme switch**: Toggle light and dark mode from the app navigation.
- **Swagger docs**: View and test the API contract in the browser.

## Stack

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- shadcn/ui-style components
- Radix UI primitives
- lucide-react icons
- next-themes for light/dark mode
- Vitest and Testing Library setup

### API

- Node.js
- Express 5
- TypeScript
- OpenAI SDK
- dotenv
- CORS
- swagger-jsdoc
- swagger-ui-express
- tsx for local development

### Monorepo

- npm workspaces
- Root scripts for running, building, linting, formatting, and testing both apps
- Shared root `package-lock.json`

## Setup

Install dependencies from the repo root:

```sh
npm install
```

Create local environment files:

```sh
cp apps/web/.env apps/web/.env
cp apps/api/.env.example apps/api/.env
```

Set your API key in `apps/api/.env`:

```sh
OPENAI_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:3000
AI_MAX_PROMPT_CHARACTERS=12000
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX_REQUESTS=10
```

The web app can proxy API calls during development. The default API URL is:

```sh
VITE_API_URL=http://localhost:5004
```

## Development

Run both apps in parallel from the repo root:

```sh
npm run dev
```

Run only the frontend:

```sh
npm run dev:web
```

Run only the API:

```sh
npm run dev:api
```

Default local URLs:

- Web app: `http://localhost:3000`
- API server: `http://localhost:5000`
- Swagger docs: `http://localhost:5000/swagger`

## Mock/API Toggle

The app navigation has a global `Mock data` / `API calls` toggle.

- **Mock data** uses local mock functions and does not require the API server or an OpenAI key.
- **API calls** sends requests from the frontend to the Express API.
- The selected mode is saved in `localStorage`, so it stays selected across page refreshes.
- The toggle applies to Summarizer, Code Explainer, and Portfolio Chat.

When API mode is enabled, make sure the API is running:

```sh
npm run dev:api
```

For the easiest local workflow, run both apps:

```sh
npm run dev
```

## Theme Switch

The app supports light and dark mode through `next-themes`.

- On desktop, the theme button is in the sidebar footer.
- On mobile, the theme button is in the top navigation beside the menu button.

## Using The AI Pages

### Summarizer

1. Open the web app.
2. Go to `Summarizer`.
3. Paste meeting notes, article text, transcript content, or other long-form text.
4. Choose a tone: `Professional`, `Concise`, or `Friendly`.
5. Click `Summarize`.

In mock mode, the app returns a local generated example. In API mode, the app sends a prompt to `POST /ai/ask` and asks the model to return structured JSON for the UI.

### Code Explainer

1. Go to `Code Explainer`.
2. Paste code into the form.
3. Select the language.
4. Click the explain action.

In mock mode, the app returns a local code explanation. In API mode, the app sends the code to the API and asks for an overview, step-by-step explanation, important concepts, and possible improvements.

### Portfolio Chat

1. Go to `Portfolio Chat`.
2. Ask a question about projects, experience, architecture, frontend work, backend APIs, or AI work.
3. Continue the conversation or reset the chat.

In mock mode, the app returns a local portfolio-style response. In API mode, the app sends the recent conversation and the new question to the API.

Before using Portfolio Chat in API mode, generate the retrieval index once:

```sh
npm run ingest:portfolio
```

This reads the markdown files under `data/portfolio` (or the legacy `data/protfolio` folder in this repo) and writes `data/portfolio-index.json`. The command requires `OPENAI_API_KEY` in `apps/api/.env` because it creates embeddings for retrieval.

## API

The API currently exposes:

```txt
POST /ai/ask
```

Example request body:

```json
{
  "prompt": "Explain React hooks in one paragraph."
}
```

Example response body:

```json
{
  "reply": "React hooks let function components manage state and side effects..."
}
```

The AI endpoint validates prompt shape and size before calling OpenAI, then
rate-limits requests per client IP. These controls are configured with the
`AI_MAX_PROMPT_CHARACTERS`, `AI_RATE_LIMIT_WINDOW_MS`, and
`AI_RATE_LIMIT_MAX_REQUESTS` API environment variables.

Swagger docs are available at:

```txt
http://localhost:5000/swagger
```

## Scripts

Root scripts:

```sh
npm run dev          # Run the API and frontend in parallel
npm run dev:web      # Run the frontend
npm run dev:api      # Run the API
npm run build        # Build all workspaces
npm run build:web    # Build the frontend
npm run build:api    # Build the API
npm run lint         # Lint all workspaces
npm run lint:fix     # Fix lint issues where possible
npm run format       # Format the repo
npm run format:check # Check formatting
npm run test         # Run tests
npm run test:web     # Run frontend tests
npm run start:api    # Build and start the compiled API
```

## Project Structure

```txt
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── config
│   │   │   │   ├── openai.ts
│   │   │   │   └── swagger.ts
│   │   │   ├── middleware
│   │   │   │   └── rate-limit.ts
│   │   │   ├── routes
│   │   │   │   └── ai.ts
│   │   └── package.json
│   └── web
│       ├── src
│       │   ├── components
│       │   ├── features
│       │   ├── pages
│       │   ├── routes
│       │   └── main.tsx
│       └── package.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Notes

- `apps/api/dist` and `apps/web/dist` are generated build outputs.
- Do not edit generated files in `dist`; update files in `src` and rebuild.
- The frontend dev server proxies `/ai` requests to the API server with Vite.
- The API route docs are generated from JSDoc comments in `apps/api/src/routes`.
