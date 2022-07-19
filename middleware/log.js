const logger = (req, res, next) => {
  try {
    // console.log(`${req.method} ${req.originalUrl} [STARTED]`);
    const start = Date.now();
    let finish = null;

    console.log(
      `[START]${start} >>> ${req.method} => ${req.originalUrl} : -ms`,
      {
        params: req.params,
        query: req.query,
        body: req.body,
      }
    );

    res.on("finish", () => {
      finish = Date.now();
      // console.log(`${req.method} ${req.originalUrl} [FINISHED]`);
    });

    res.on("close", () => {
      const duration = finish - start;
      console.log(
        `[CLOSE]${start} >>> ${req.method} => ${req.originalUrl} : ${duration}ms `,
        {
          params: req.params,
          query: req.query,
          body: req.body,
        }
      );
    });

    next();
  } catch (error) {
    // console.log("Error at logJs.");

    next(error);
  }
};

module.exports = {
  logger,
};
