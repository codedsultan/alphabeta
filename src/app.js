import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import cron from "node-cron";



export const runApp = () => {
    const app = express();
  
    // Middlewares
    app.use(
      cors({
        origin: "*",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        credentials: true,
        exposedHeaders: ["x-auth-token"],
      })
    );
    app.use(helmet());
    app.use(compression());
    app.use(morgan("combined"));
    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.set("trust proxy", true);
  
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "public")));
  
    // Schedule a task
    // cron.schedule("59 23 * * *", () => {
    //   console.log("[cron]: task running every day at 11:59 PM");
    //   utility.deleteExpiredOTPs();
    // });
  
    return app;
  };
  
  export const closeApp = (app) => {
    // Middleware for Errors
    app.use(errorMiddleware);
    app.use("*", (req, res, next) => {
      res.status(404).json({
        success: false,
        server: "online",
        message: "api endpoint not found",
      });
    });
  };