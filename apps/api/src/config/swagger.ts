import swaggerJsdoc from 'swagger-jsdoc';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || '5000';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Backend API",
      version: "1.0.0",
      description: "A simple Node.js backend for AI requests.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local development server",
      },
    ],
  },
  apis: [resolve(__dirname, '../routes/*.{ts,js}')],
};

export const openApiDocument = swaggerJsdoc(options)
