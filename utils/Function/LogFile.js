const fs = require("fs");
const { getDateTHFormat } = require("../Construct/getDateTHFormat");

const readLogFile = async () => {
  const data_th = getDateTHFormat();
  const { date_th_isoString, date_th_dateOnly, date_th_timeOnly } = data_th;
  // console.log(data_th);

  let log = { error: [], info: [] };

  try {
    const log_json = fs.readFileSync(
      `./logs/log_${date_th_dateOnly}.json`,
      "utf8"
    );

    log = JSON.parse(log_json);
    // console.log(log);
  } catch (error) {
    log.error.push({
      time_th: date_th_isoString,
      error_stack: error.stack,
      error_message: error.message,
    });
    // console.log(log);

    fs.writeFileSync(
      `./logs/log_${date_th_dateOnly}.json`,
      JSON.stringify(log)
    );
  }

  return log;
};

const writeLogFile = async (info = null, error = null) => {
  const data_th = getDateTHFormat();
  const { date_th_isoString, date_th_dateOnly, date_th_timeOnly } = data_th;
  // console.log(data_th);

  const log = await readLogFile();
  let log_updated = false;

  if (info !== null) {
    info.time_th = date_th_isoString;
    log.info.push(info);

    log_updated = true;
  }
  if (error !== null) {
    log.error.push({
      time_th: date_th_isoString,
      error_stack: error.stack,
      error_message: error.message,
    });

    log_updated = true;
  }

  if (log_updated === true) {
    fs.writeFileSync(
      `./logs/log_${date_th_dateOnly}.json`,
      JSON.stringify(log)
    );
  }

  return;
};

module.exports = { readLogFile, writeLogFile };
