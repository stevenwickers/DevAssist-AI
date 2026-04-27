import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from './config/swagger.js'
import aiRouter from "./routes/ai.js";
import portfolioChatRouter from './routes/portfolio-chat.js'

const app = express();

app.use(
  cors({
    origin: '*', //DEV ONLY: Include Origins in higher envs
    credentials: true,
  })
);

app.use(express.json({ limit: '64kb' }));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/ai", aiRouter);
app.use('/ai', portfolioChatRouter)

app.get("/", (_req, res) => {
  res.redirect("/swagger");
});

export default app;
