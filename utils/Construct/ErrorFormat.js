exports.ErrorFormat = (error) => {
  const devError = {
    res_code: "8888",
    res_type: "error",
    res_stack: error.stack,
    res_message: error.message,
    res_data: {},
  };
  const prodError = {
    res_code: "8888",
    res_message: "Server error.",
    res_data: {},
  };

  return {
    devError,
    prodError,
  };
};
