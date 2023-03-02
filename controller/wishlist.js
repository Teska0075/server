const fs = require("fs");
const filePath = "./data/wishlist.json";
const getWishlist = (req, res) => {
  try {
    const wishlist = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(wishlist);
    res.status(200).json({ message: "success", data: data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteWishlist = (req, res) => {
  try {
    const { id } = req.params;
    const data = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(data);
    const findIndex = parsedData.wishlist.findIndex((el) => el.id === id);
    if (findIndex == -1) {
      return res.status(402).json({ message: "iim id tai wishlist bhgui bn" });
    }
    parsedData.wishlist.splice(findIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(parsedData));
    res
      .status(201)
      .json({ message: `${id} тай category амжилттай устгагдлаа.` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { getWishlist, deleteWishlist };
