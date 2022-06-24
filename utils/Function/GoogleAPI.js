const axios = require("axios");
const Decimal = require("../Decimal");
const Validator = require("../Validator");
const Location_OBJ = require("../Class/Location_OBJ");

exports.getSnapToRoads = async (PATH) => {
  const res = {
    isError: false,
    data: null,
  };

  try {
    /**
     * SWITCH; Validate input parameter (PATH)
     */
    switch (true) {
      case !PATH:
        throw new Error("PATH is require.");
        break;

      case PATH && !Validator.isArray(PATH):
        throw new Error("PATH must be Array.");
        break;

      // case PATH && !PATH.length > 1:
      case PATH && !Decimal.OP(PATH.length, 1, ">"):
        throw new Error(
          "PATH Array require to has/have length greaterThan or equal 2."
        );
        break;

      default:
        break;
    }

    let interpolate = true;
    let path = "";

    for (let x = 0; x < PATH.length; x++) {
      const data_x = PATH[x].location;

      path =
        path +
        (path.length === 0 ? "" : "|") +
        data_x.latitude +
        "," +
        data_x.longitude;
    }

    const PARAMETER = `?interpolate=${interpolate}&path=${path}&key=${process.env.GOOGLE_API_KEY}`;

    const configs = {
      method: "get",
      url: `${process.env.GOOGLE_API_ROADS_URL}/snapToRoads${PARAMETER}`,
      headers: {},
    };
    console.log(configs.url);

    const FETCH = await axios(configs);

    res.isError = false;
    res.data = FETCH.data;
  } catch (error) {
    console.log(error.message);

    res.isError = true;
    res.data = error.message;
  }

  return res;
};

exports.getDirections = async (STARTING_POINT, DESTINATION_POINT) => {
  const res = {
    isError: false,
    data: null,
  };

  try {
    /**
     * SWITCH; input parameter (obj)
     */
    switch (true) {
      case !STARTING_POINT:
        throw new Error("STARTING_POINT is require.");
        break;

      case STARTING_POINT && !Validator.isOject(STARTING_POINT):
        throw new Error("STARTING_POINT must be Object.");
        break;

      case !STARTING_POINT.hasOwnProperty("latitude") &&
        !STARTING_POINT.hasOwnProperty("longitude"):
        throw new Error(
          "STARTING_POINT Object require property 'latitude' and 'longitude'."
        );
        break;

      case !DESTINATION_POINT:
        throw new Error("DESTINATION_POINT is require.");
        break;

      case DESTINATION_POINT && !Validator.isOject(DESTINATION_POINT):
        throw new Error("DESTINATION_POINT must be Object.");
        break;

      case !DESTINATION_POINT.hasOwnProperty("latitude") &&
        !DESTINATION_POINT.hasOwnProperty("longitude"):
        throw new Error(
          "DESTINATION_POINT Object require property 'latitude' and 'longitude'."
        );
        break;

      default:
        break;
    }

    let alternatives = false; // false for get only 1 path
    let avoid = "indoor"; // "tolls|highways|ferries|indoor";
    let mode = ""; // "driving";

    const PARAMETER = `?origin=${STARTING_POINT.latitude},${STARTING_POINT.longitude}&destination=${DESTINATION_POINT.latitude},${DESTINATION_POINT.longitude}&alternatives=${alternatives}&avoid=${avoid}&mode=${mode}&key=${process.env.GOOGLE_API_KEY}`;

    const configs = {
      method: "get",
      url: `${process.env.GOOGLE_API_MAPS_URL}/directions/json${PARAMETER}`,
      headers: {},
    };
    console.log(configs.url);

    const FETCH = await axios(configs);

    res.isError = false;
    res.data = FETCH.data;
  } catch (error) {
    console.log(error.message);

    res.isError = true;
    res.data = error.message || null;
  }

  return res;
};

exports.getBetweenPoint = (DISTANCE, START_LOCATION_OBJ, END_LOCATION_OBJ) => {
  const res = {
    isError: false,
    data: null,
  };

  try {
    /**
     * SWITCH; input parameter
     */
    switch (true) {
      case !DISTANCE:
        throw new Error("DISTANCE is require.");
        break;

      case DISTANCE && isNaN(DISTANCE):
        throw new Error("DISTANCE must be number.");
        break;

      case DISTANCE && Decimal.OP(DISTANCE, process.env.MAXIMUM_DISTANCE, "<"):
        throw new Error("DISTANCE value not meet requirement.");
        break;

      case !START_LOCATION_OBJ:
        throw new Error("START_LOCATION_OBJ is require.");
        break;

      case START_LOCATION_OBJ && !Validator.isOject(START_LOCATION_OBJ):
        throw new Error("START_LOCATION_OBJ must be Object.");
        break;

      case !START_LOCATION_OBJ.hasOwnProperty("location"):
        throw new Error(
          "START_LOCATION_OBJ Object require property 'location'."
        );
        break;

      case !START_LOCATION_OBJ.location.hasOwnProperty("latitude") &&
        !START_LOCATION_OBJ.location.hasOwnProperty("longitude"):
        throw new Error(
          "START_LOCATION_OBJ.location Object require property 'latitude' and 'longitude'."
        );
        break;

      case !END_LOCATION_OBJ:
        throw new Error("END_LOCATION_OBJ is require.");
        break;

      case END_LOCATION_OBJ && !Validator.isOject(END_LOCATION_OBJ):
        throw new Error("END_LOCATION_OBJ must be Object.");
        break;

      case !END_LOCATION_OBJ.hasOwnProperty("location"):
        throw new Error("END_LOCATION_OBJ Object require property 'location'.");
        break;

      case !END_LOCATION_OBJ.location.hasOwnProperty("latitude") &&
        !END_LOCATION_OBJ.location.hasOwnProperty("longitude"):
        throw new Error(
          "END_LOCATION_OBJ.location Object require property 'latitude' and 'longitude'."
        );
        break;

      default:
        break;
    }

    const start_location = START_LOCATION_OBJ.location;
    const end_location = END_LOCATION_OBJ.location;
    // console.log({ start_location, end_location });

    res.data = [];
    res.data.push(
      new Location_OBJ(start_location.latitude, start_location.longitude)
    );

    // let countOfPoints = Math.round(DISTANCE / 300);
    let countOfPoints = Decimal.roundNumber(Decimal.div(DISTANCE, 300));
    // console.log("countOfPoints", countOfPoints);

    // if (countOfPoints > 1) {
    if (Decimal.OP(countOfPoints, 1, ">")) {
      // let latDiff = (start_location.lat - end_location.lat) / countOfPoints;
      // console.log(
      //   "Decimal.minus((start_location.latitude, end_location.latitude))",
      //   Decimal.minus(start_location.latitude, end_location.latitude)
      // );
      let latDiff = Decimal.div(
        Decimal.minus(start_location.latitude, end_location.latitude),
        countOfPoints
      );
      // console.log("latDiff", latDiff);
      // let lonDiff = (start_location.lng - end_location.lng) / countOfPoints;
      // console.log(
      //   "Decimal.minus((start_location.longitude, end_location.longitude))",
      //   Decimal.minus(start_location.longitude, end_location.longitude)
      // );
      let lonDiff = Decimal.div(
        Decimal.minus(start_location.longitude, end_location.longitude),
        countOfPoints
      );
      // console.log("lonDiff", lonDiff);

      // for (let x = 1; x < countOfPoints; x++) {
      for (let x = countOfPoints - 1; x > 0; x = x - 1) {
        // let aveLat = end_location.lat + latDiff * x;
        let aveLat = Decimal.plus(
          end_location.latitude,
          Decimal.mul(latDiff, x)
        );
        // let aveLon = end_location.lng + lonDiff * x;
        let aveLon = Decimal.plus(
          end_location.longitude,
          Decimal.mul(lonDiff, x)
        );

        // console.log({ aveLat, aveLon });

        res.data.push(new Location_OBJ(aveLat, aveLon));
      }
    }

    res.isError = false;
    res.data.push(
      new Location_OBJ(end_location.latitude, end_location.longitude)
    );
  } catch (error) {
    console.log(error.message);

    res.isError = true;
    res.data = error.message || null;
  }

  return res;
};
