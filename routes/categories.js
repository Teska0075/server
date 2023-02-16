const { Router } = require("express");
const {
  getCategory,
  postCategory,
  getCategoryById,
  putCategoryById,
  delCategoryById,
} = require("../controller/categories");

const router = Router();

router.get("/", getCategory).post("/", postCategory);

router
  .get("/:id", getCategoryById)
  .put("/:id", putCategoryById)
  .delete("/:id", delCategoryById);

module.exports = router;
