// const test_dest = {
//   distance: { text: "0.5 km", value: 517 },
//   duration: { text: "3 mins", value: 184 },
//   end_location: { lat: 13.7993519, lng: 100.5489429 },
//   html_instructions: "Turn <b>left</b>",
//   maneuver: "turn-left",
//   polyline: {
//     points: "wefsAo_vdRINIPININvEtBh@ZHDFF@DBBBHBP@NB~A?xBAXAFCFKJMDS@M@yC@G?",
//   },
//   start_location: { lat: 13.7994835, lng: 100.5517634 },
//   travel_mode: "DRIVING",
// };

// const res_test = [];

// let MAXIMUM_DISTANCE = 300;
// let ALLOW_DISTANCE = 300;

// if (test_dest.distance.value > MAXIMUM_DISTANCE) {
//   let countOfPoints = Math.round(test_dest.distance.value / ALLOW_DISTANCE);
//   console.log("countOfPoints", countOfPoints);

//   if (countOfPoints > 1) {
//     let latDiff =
//       (test_dest.start_location.lat - test_dest.end_location.lat) /
//       countOfPoints;
//     let lonDiff =
//       (test_dest.start_location.lng - test_dest.end_location.lng) /
//       countOfPoints;

//     for (let x = 0; x < countOfPoints; x++) {
//       let aveLat = test_dest.end_location.lat + latDiff * x;
//       let aveLon = test_dest.end_location.lng + lonDiff * x;

//       res_test.push({ aveLat, aveLon });
//     }
//   }
// }

// console.log(res_test);

/** ======================= **/

// const start_location = { lat: 13.7994835, lng: 100.5517634 };
// const end_location = { lat: 13.7993519, lng: 100.5489429 };
// // const start_location = { lat: 13.799495006682049, lng: 100.55175900124837 };
// // const end_location = { lat: 13.799381107977442, lng: 100.54898478584 };
// const distance_GGL = { text: "0.5 km", value: 517 };

// // const getEstimatedDistanceBetweenPoints = (currentLatlon, lastLatLon) => {
// //   dif_lat = lastLatLon.lat - currentLatlon.lat;
// //   dif_lng = lastLatLon.lng - currentLatlon.lng;

// //   console.log({ dif_lat, dif_lng });

// //   return Math.sqrt(Math.pow(dif_lat, 2) + Math.pow(dif_lng, 2)) * 1.113195e5;
// // };

// // const distance_CAL = getEstimatedDistanceBetweenPoints(
// //   start_location,
// //   end_location
// // );
// // console.log(distance_CAL);

// // if (distance_GGL.value > 300) {
// //   let countOfPoints_GGL = Math.round(distance_GGL.value / 300);
// //   console.log("countOfPoints_GGL", countOfPoints_GGL);

// //   if (countOfPoints_GGL > 1) {
// //     let latDiff = (end_location.lat - start_location.lat) / countOfPoints_GGL;
// //     let lonDiff = (end_location.lng - start_location.lng) / countOfPoints_GGL;

// //     for (let x = 0; x < countOfPoints_GGL; x++) {
// //       let aveLat = start_location.lat + latDiff * x;
// //       let aveLon = start_location.lng + lonDiff * x;

// //       console.log({ aveLat, aveLon });
// //     }
// //   }
// // }
// if (distance_GGL.value > 300) {
//   let countOfPoints_GGL = Math.round(distance_GGL.value / 300);
//   console.log("countOfPoints_GGL", countOfPoints_GGL);

//   if (countOfPoints_GGL > 1) {
//     let latDiff = (start_location.lat - end_location.lat) / countOfPoints_GGL;
//     let lonDiff = (start_location.lng - end_location.lng) / countOfPoints_GGL;

//     for (let x = 1; x < countOfPoints_GGL; x++) {
//       let aveLat = end_location.lat + latDiff * x;
//       let aveLon = end_location.lng + lonDiff * x;

//       console.log({ aveLat, aveLon });
//     }
//   }
// }

/** ======================= **/
