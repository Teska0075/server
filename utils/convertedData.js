exports.convertQuery = (obj) => {
  Object.keys(body)
    .map((key) => `${key}="${body[key]}"`)
    .join("");
};
