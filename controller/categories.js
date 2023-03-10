const fs = require("fs");
const { resourceLimits } = require("worker_threads");
const connection = require("../config/db");
const convertData = require("../utils/convertedData");

const getCategory = (req, res) => {
  const query = "SELECT * FROM categories";

  connection.query(query, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ categories: result });
  });
};

const postCategory = (req, res) => {
  const { title, imageUrl, desc, agent_id } = req.body;

  const query =
    "INSERT INTO categories (id, title,image,description,agent_id) VALUES(null, ?, ?, ?, ?)";
  connection.query(query, [title, imageUrl, desc, agent_id], (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: "Шинэ категор амжилттай бүртгэгдлээ." });
  });
};

const getCategoryById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM categories WHERE id=${id}`;

  connection.query(query, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ category: result });
  });
};

const putCategoryById = (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const parsedData = convertData(body);

  const query = `UPDATE categories SET ${parsedData} WHERE id=${id}`;

  connection.query(query, (err, result) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(200).json({ message: `${id} id-тай категор шинэчл` });
  });
};

const delCategoryById = (req, res) => {
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
};

module.exports = {
  getCategory,
  postCategory,
  getCategoryById,
  putCategoryById,
  delCategoryById,
};
