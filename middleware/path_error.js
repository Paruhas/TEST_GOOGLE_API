module.exports = (req, res, next) => {
  return res
    .status(404)
    .json({ res_code: "9999", res_message: "Path not found.", res_data: {} });
};
