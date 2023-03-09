const fs = require("fs");
const connection = require("../config/db");
const bcrypt = require("bcrypt");

const getUsers = (req, res) => {
  const users = fs.readFile("./data/users.json", "utf-8", (err, data) => {
    if (err) {
      console.log("There is an error!!!");
      return;
    }
    const parsedData = JSON.parse(data);
    res.status(201).json({ users: parsedData.users });
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("./data/users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const user = parsedData.users.find((el) => el.id === id);
  res.status(200).json({ user });
};

const createUser = (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  const salted = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salted);

  const query =
    "INSERT INTO users (id, role, name,email,password, phone_number, profileimg) VALUES(null, null, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [name, email, hashedPassword, phoneNumber, "url"],
    (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res
        .status(201)
        .json({ message: "Шинэ хэрэглэгч амжилттай бүртгэгдлээ." });
    }
  );
};

const putUserById = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const data = fs.readFileSync("./data/users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findIndex = parsedData.users.findIndex((el) => el.id === id);
  parsedData.users[findIndex].name = name;
  fs.writeFileSync("./data/users.json", JSON.stringify(parsedData));
  res.status(201).json({ message: "User info successfully changed" });
};

const delUserById = (req, res) => {
  const { id } = req.params;
  const data = fs.readFileSync("./data/users.json", "utf-8");
  const parsedData = JSON.parse(data);
  const findIndex = parsedData.users.findIndex((el) => el.id === id);
  parsedData.users.splice(findIndex, 1);
  fs.writeFileSync("./data/users.json", JSON.stringify(parsedData));
  res.status(201).json({ message: `${id}: User deleted` });
};

module.exports = {
  getUsers,
  getUserById,
  putUserById,
  delUserById,
  createUser,
};
