const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(helmet());

// Confia no proxy reverso (Cloud Run / nginx) para obter IP real do cliente
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP a cada 15 min
  standardHeaders: true,  // Retorna info em cabeçalhos RateLimit-*
  legacyHeaders: false,   // Desabilita cabeçalhos X-RateLimit-* legados
});
// Limita as rotas da API
app.use("/api", limiter);

//
const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ["http://localhost:5173", "http://127.0.0.1:5173"],
  optionsSuccessStatus: 200,
};

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors(corsOptions));
// Em produção usa 'combined' (formato Apache) para não vazar detalhes internos
app.use(logger(app.get("env") === "production" ? "combined" : "dev"));
// Limita tamanho do body a 10kb para evitar ataques de payload gigante
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
// Assina cookies com secret para garantir integridade
app.use(cookieParser(process.env.COOKIE_SECRET || "changeme-in-production"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/data", indexRouter);
app.use("/api/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
