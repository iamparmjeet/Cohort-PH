import cors from "cors";
import express from "express";

import * as middlewares from "@/middlewares/middlewares";
import { pinoLogger } from "@/middlewares/pino-logger";

import env from "./utils/env";

const app = express();

const port = env.PORT || 8000;

app.get("/health", (req, res) => {
  res.send("Health Ok");
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}...`);
});

app.use(cors());
app.use(express.json());
app.use(pinoLogger());

app.use(middlewares.serveEmojiFavicon("✨"));

app.use(middlewares.notFound);
app.use(middlewares.onError);

export default app;
