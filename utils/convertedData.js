exports.convertQuery = (body) => {
  Object.keys(body).map((key) => `${key}="${body[key]}"`).join("");
};
