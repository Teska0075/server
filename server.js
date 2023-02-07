const express = require("express");
const cors = require("cors");
const server = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const port = 8000;

server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "Hello Express Server" });
});

//Start of User

server.post("/signup", (req, res) => {
  const { name, role = "user", email, password } = req.body;
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
  res.status(201).json({ message: "New User Added Successfully " });
});

server.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const data = fs.readFileSync("users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findUser = parsedData.users.find((user) => user.email === email);
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

// End of User
// Start of Category

server.post("/categories", (req, res) => {
  try {
    const content = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(content);
    const newData = { ...req.body };
    data.categories.push(newData);
    fs.writeFileSync("categories.json", JSON.stringify(data));
    res.status(201).json({ message: "Category added", data: newData });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  res.json();
});

server.get("/categories", (req, res) => {
  try {
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    res.status(200).json({ message: "success", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  res.json();
});

server.get("/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    const category = data.categories.find((el) => el.id === id);
    res.status(201).json({ category });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

server.put("/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    const findIndex = data.categories.findIndex((el) => el.id === id);
    data.categories[findIndex].title = title;
    fs.writeFileSync("categories.json", JSON.stringify(data));
    res
      .status(201)
      .json({ message: `${id}: Category title updated to ${title}` });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

server.delete("/categories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    const findIndex = data.categories.findIndex((el) => el.id === id);
    data.categories.splice(findIndex, 1);
    fs.writeFileSync("categories.json", JSON.stringify(data));
    res.status(201).json({ message: `${id}: Category deleted` });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});
// End of Category
server.listen(port, () => {
  console.log(`Server aslaa port ${port}`);
});
