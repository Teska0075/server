const { Router } = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const {
  getUsers,
  getUserById,
  putUserById,
  delUserById,
  createUser,
} = require("../controller/users");

const router = Router();

router.get("/", getUsers);

router
  .post("/", createUser)
  .get("/:id", getUserById)
  .put("/:id", putUserById)
  .delete("/:id", delUserById);

// Start of Auth

router.post("/signup", (req, res) => {
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

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const data = fs.readFileSync("./data/users.json", "utf-8");
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

// End of Auth

module.exports = router;
