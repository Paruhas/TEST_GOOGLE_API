const axios = require("axios");
const Decimal = require("../Decimal");
const Validator = require("../Validator");
const Location_OBJ = require("../Class/Location_OBJ");
const Polyline = require("../Function/Polyline");

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
    console.log({ "URL_GoogleAPI.getSnapToRoads": configs.url });

    const FETCH = await axios(configs);

    if (FETCH.data.hasOwnProperty("error")) {
      throw new Error(FETCH.data.error.status);
    }

    res.isError = false;
    res.data = FETCH.data;
    res.url = configs.url;
  } catch (error) {
    console.log(error.message);

    res.isError = true;
    res.data = error.message;
  }

  return res;
};

exports.getDirections = async (
  STARTING_POINT,
  DESTINATION_POINT,
  ALTERNATIVES,
  AVOID,
  MODE
) => {
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

    let alternatives = ALTERNATIVES || false; // false for get only 1 path
    let avoid = AVOID || ""; // "tolls|highways|ferries|indoor";
    let mode = MODE || "driving "; // "driving";

    const PARAMETER = `?origin=${STARTING_POINT.latitude},${STARTING_POINT.longitude}&destination=${DESTINATION_POINT.latitude},${DESTINATION_POINT.longitude}&alternatives=${alternatives}&avoid=${avoid}&mode=${mode}&key=${process.env.GOOGLE_API_KEY}`;

    const configs = {
      method: "get",
      url: `${process.env.GOOGLE_API_MAPS_URL}/directions/json${PARAMETER}`,
      headers: {},
    };
    console.log({ "URL_GoogleAPI.getDirections": configs.url });

    const FETCH = await axios(configs);

    if (FETCH.data.status !== "OK") {
      throw new Error(FETCH.data.status);
    }

    res.isError = false;
    res.data = FETCH.data;
    res.url = configs.url;
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

exports.getShortestRoutes_fromGoogleDirections = (arr) => {
  try {
    let shortest = arr[0];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i].legs[0].distance.value < shortest.legs[0].distance.value) {
        shortest = arr[i];
      }
    }

    return { isError: false, data: shortest };
  } catch (error) {
    console.log(error.message);

    return { isError: true, data: error.message || null };
  }
};

exports.decodeMAPS = (arr_steps) => {
  const res = {
    isError: false,
    data: null,
  };
  const arr_res = [];
  let arr_separate = [];

  try {
    for (let x = 0; x < arr_steps.length; x++) {
      const data_x = arr_steps[x];

      if (
        data_x.maneuver &&
        Decimal.OP(data_x.maneuver.search("uturn"), -1, "!=")
      ) {
        if (arr_separate.length !== 0) {
          arr_res.push(arr_separate);

          arr_separate = [];
        }

        continue;
      }

      if (Decimal.OP(data_x.distance.value, 300, ">")) {
        if (arr_separate.length !== 0) {
          arr_res.push(arr_separate);

          arr_separate = [];
        }

        const res_Polyline_decode = Polyline.decode(data_x.polyline.points);
        const res_Polyline_clean = Polyline.clean(res_Polyline_decode);

        res_Polyline_clean.forEach((item) => {
          item.maneuver = data_x.maneuver || null;
        });

        res_Polyline_clean.unshift("POLYLINE");

        arr_res.push(res_Polyline_clean);

        continue;
      }

      const start = new Location_OBJ(
        data_x.start_location.lat,
        data_x.start_location.lng
      );
      const end = new Location_OBJ(
        data_x.end_location.lat,
        data_x.end_location.lng
      );
      start.maneuver = data_x.maneuver || null;
      end.maneuver = data_x.maneuver || null;

      arr_separate.push(start, end);

      if (Decimal.OP(x, arr_steps.length - 1, "=")) {
        if (arr_separate.length !== 0) {
          arr_res.push(arr_separate);
        }
      }
    }

    res.isError = false;
    res.data = arr_res;
  } catch (error) {
    console.log(error.message);

    res.isError = true;
    res.data = error.message || null;
  }

  return res;
};

exports.getSnapToRoads_V2 = async (arr3d) => {
  try {
    let res = undefined;

    if (arr3d[0] !== "POLYLINE") {
      let interpolate = true;
      let path = "";

      for (let x = 0; x < arr3d.length; x++) {
        const data_x = arr3d[x].location;

        path =
          path +
          (Decimal.OP(path.length, 0, "=") ? "" : "|") +
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
      console.log({ "URL_GoogleAPI.getSnapToRoads_V2": configs.url });

      const FETCH = await axios(configs);

      if (FETCH.data.hasOwnProperty("error")) {
        throw new Error(FETCH.data.error.status);
      }

      res = FETCH.data.snappedPoints;

      let OBJ_last_LatLng = {
        lat: "",
        lng: "",
      };
      res = res.filter((item) => {
        if (
          OBJ_last_LatLng.lat === item.location.latitude &&
          OBJ_last_LatLng.lng === item.location.longitude
        ) {
          OBJ_last_LatLng.lat = item.location.latitude;
          OBJ_last_LatLng.lng = item.location.longitude;

          return;
        }

        OBJ_last_LatLng.lat = item.location.latitude;
        OBJ_last_LatLng.lng = item.location.longitude;

        item.maneuver = arr3d[0].maneuver;

        return item;
      });
    }

    if (arr3d[0] === "POLYLINE") {
      arr3d.shift();

      res = arr3d;
    }

    return res;
  } catch (error) {
    console.log(error);

    return null;
  }
};
