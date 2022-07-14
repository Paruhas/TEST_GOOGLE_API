const { readFileSync } = require("fs");
const homePage = readFileSync("./utils/HTML/home.html", "utf8");

module.exports = (req, res, next) => {
  try {
    return res.send(homePage);
  } catch (error) {
    next(error);
  }
};
