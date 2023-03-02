const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const usersRoute = require("./routes/users");
const categoriesRoute = require("./routes/categories");
const wishlistRoute = require("./routes/wishlist");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "azure_db",
});

const port = 8000;
const server = express();
//middleware
server.use(cors());
server.use(express.json());

server.use("/users", usersRoute);
server.use("/categories", categoriesRoute);
server.use("/wishlist", wishlistRoute);

server.get("/", async (req, res) => {
  connection.query("SELECT * FROM azure_user", (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(200).json({ message: "Amjilttai", data: result });
  });
  // res.json({ message: "Hello from AZURE TRAVEL" });
});

server.get("/:id", async (req, res) => {
  const { id } = req.params;
  connection.query(
    `SELECT * FROM azure_user WHERE a_id=${id}`,
    (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      res.status(200).json({ message: "Amjilttai", data: result });
    }
  );
  // res.json({ message: "Hello from AZURE TRAVEL" });
});

server.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  connection.query(
    `UPDATE azure_user SET name="${name}" WHERE a_id=${id}`,
    (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      res.status(200).json({ message: "Amjilttai", data: result });
    }
  );
});

server.delete("/:id", async (req, res) => {
  const { id } = req.params;
  connection.query(`DELETE FROM azure_user WHERE a_id=${id}`, (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(200).json({ message: "Amjilttai", data: result });
  });
});

server.post("/", async (req, res) => {
  const { id, name, ovog } = req.body;
  // const id = req.body.id;
  // const name = req.body.name;
  // const ovog = req.body.ovog;
  console.log(id);
  connection.query(
    `INSERT INTO azure_user(a_id,name,ovog) VALUE ('${id}','${name}','${ovog}')`,
    (err, result) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      res.status(200).json({ message: "Amjilttai", data: result });
    }
  );
});

server.listen(port, () => {
  console.log(`Server aslaa port ${port}`);
});
