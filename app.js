// const express = require("express");
// const app = express();
// app.use(express.json());

// const users = [
//   {
//     id: "1",
//     password: "password",
//   },
//   {
//     id: "2",
//     password: "password",
//   },
//   {
//     id: "3",
//     password: "password",
//   },
// ];

// app.get("/users", (req, res) => {
//   res.json(users);
// });

// app.post("/users", (req, res) => {
//   const { id, password } = req.body;

//   if (!id || !password) {
//     return res.status(400).json({ error: "ID와 password를 입력하세요." });
//   }

//   const existingUser = users.find((user) => user.id === id);
//   if (existingUser) {
//     return res
//       .status(409)
//       .json({ error: "같은 ID를 가진 사용자가 존재합니다." });
//   }

//   const newUser = { id, password };
//   users.push(newUser);

//   res.status(201).json({ message: "유저 등록 완." });
// });
// // postman의 Body-raw-JSON 에서
// // { "id": "4", "password": "0123" } 입력 필수

// app.delete("/users/:id", (req, res) => {
//   const id = req.params.id;

//   const index = users.findIndex((user) => user.id === id);
//   if (index === -1) {
//     return res.status(404).json({ error: "유저 없음." });
//   }
//   users.splice(index, 1);

//   res.json({ message: "유저 삭제 완." });
// });
// // postman에서 /:id가 아니라 1이나 2처럼 지울 유저의 id 입력 필.

// app.listen(8080, () => {
//   console.log("Server: 8080");
// });

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const corsConfig = require("./config/corsConfig.json");

const models = require("./models/index");
const logger = require("./lib/logger");

dotenv.config();

const { NODE_ENV, PORT, LOGGER_LEVEL } = process.env;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

logger.info("app start !!");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// sequelize 세팅
models.sequelize
  .sync()
  .then(() => {
    logger.info("Sequelize sync success");
  })
  .catch((err) => {
    logger.error("Sequelize sync error", err);
  })
  .catch((err) => {
    logger.error("DB connection fail", err);
  });

// app.use(logger('dev'));
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
