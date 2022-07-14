module.exports = (req, res, next) => {
  try {
    return res.status(200).json({
      res_code: "0000",
      res_message: "RUN VERSION CHECK SUCCESSFUL.",
      res_data: {},
    });
  } catch (error) {
    next(error);
  }
};
