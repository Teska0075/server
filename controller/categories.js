const fs = require("fs");

const getCategory = (req, res) => {
  try {
    const categoriesData = fs.readFileSync("./data/categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    res.status(200).json({ message: "success", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  res.json();
};
const postCategory = (req, res) => {
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
};

const getCategoryById = (req, res) => {
  try {
    const { id } = req.params;
    const categoriesData = fs.readFileSync("categories.json", "utf-8");
    const data = JSON.parse(categoriesData);
    const category = data.categories.find((el) => el.id === id);
    res.status(201).json({ category });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const putCategoryById = (req, res) => {
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
