const express = require("express");
const cors = require("cors");
const server = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const port = 8001;

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "Hello Express Server" });
});

server.post("/signup", (req, res) => {
  const { name, role, email, password } = req.body;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const id = uuidv4();
  const salted = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salted);

  const newUser = {
    id,
    name,
    role,
    email,
    password: hashedPassword,
  };

  parsedData.users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(parsedData));
  res.status(201).json({ message: "New User " });
});

server.post("/signin", (req, res) => {
  const { id, email, password } = req.body;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findUser = parsedData.users.find((user) => user.id === id);
  if (!findUser) {
    res.status(401).json({ message: "User not found" });
  }

  const isCheck = bcrypt.compareSync(password, findUser.password);
  if (isCheck) {
    res.status(201).json({ message: "Successfuly signed in", user: findUser });
  } else {
    res
      .status(401)
      .json({ message: "Email or Password is incorrect", user: null });
  }
});

server.get("/users", (req, res) => {
  const users = fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
      console.log("There is an error!!!");
      return;
    }
    const parsedData = JSON.parse(data);
    res.status(201).json({ users: parsedData.users });
  });
});

server.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const user = parsedData.users.find((el) => el.id === id);
  res.status(200).json({ user });
});

server.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findIndex = parsedData.users.findIndex((el) => el.id === id);
  parsedData.users[findIndex].name = name;
  fs.writeFileSync("users.json", JSON.stringify(parsedData));
  res.status(201).json({ message: "User info successfully changed" });
});

server.delete("users/:id", (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findIndex = parsedData.users.findIndex((el) => el.id === id);
  parsedData.users.splice(findIndex, 1);
  fs.writeFileSync("users.json", JSON.stringify(parsedData));
  res.status(201).json({ message: `${id}: User deleted` });
});

server.listen(port, () => {
  console.log(`Server aslaa port ${port}`);
});
