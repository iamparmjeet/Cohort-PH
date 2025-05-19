import cookieParser from "cookie-parser"
import cors from "cors";
import express from "express";

import * as middlewares from "@/middlewares/middlewares";
import { pinoLogger } from "@/middlewares/pino-logger";
import userRoutes from "@/routes/user/user.routes";

import DB from "./utils/db";
import env from "./utils/env";

const app = express();

const port = env.PORT || 8000;

app.use(pinoLogger());

app.use(cors({
  origin: env.SITE_URL,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(cookieParser())

app.get("/api/v1/health", (req, res) => {
  res.json({
    message: "Health Ok",
  });
});

// connect db
DB();

// routes
const routes = [
  userRoutes,
] as const;

routes.forEach((route) => {
  app.use("/api/v1/users", route);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}...`);
});

app.use(middlewares.serveEmojiFavicon("✨"));

app.use(middlewares.notFound);
app.use(middlewares.onError);

export default app;
