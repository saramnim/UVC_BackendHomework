const express = require("express");
const app = express();
app.use(express.json());

const users = [
  {
    id: "1",
    password: "password",
  },
  {
    id: "2",
    password: "password",
  },
  {
    id: "3",
    password: "password",
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ error: "ID와 password를 입력하세요." });
  }

  const existingUser = users.find((user) => user.id === id);
  if (existingUser) {
    return res
      .status(409)
      .json({ error: "같은 ID를 가진 사용자가 존재합니다." });
  }

  const newUser = { id, password };
  users.push(newUser);

  res.status(201).json({ message: "유저 등록 완." });
});
// postman의 Body-raw-JSON 에서
// { "id": "4", "password": "0123" } 입력 필수

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "유저 없음." });
  }
  users.splice(index, 1);

  res.json({ message: "유저 삭제 완." });
});
// postman에서 /:id가 아니라 1이나 2처럼 지울 유저의 id 입력 필.

app.listen(8080, () => {
  console.log("Server: 8080");
});
