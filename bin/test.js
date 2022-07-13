const a = {
  snappedPoints: [
    {
      location: {
        latitude: 13.779577,
        longitude: 100.629808,
      },
      maneuver: null,
    },
    {
      location: {
        latitude: 13.779615666580613,
        longitude: 100.62961416673386,
      },
      originalIndex: 0,
      placeId: "ChIJhQY0PQNiHTERtaA6LsBKTGo",
      maneuver: null,
    },
    {
      location: {
        latitude: 13.779907599999996,
        longitude: 100.6296762,
      },
      originalIndex: 1,
      placeId: "ChIJhQY0PQNiHTERtaA6LsBKTGo",
      maneuver: null,
    },
    {
      location: {
        latitude: 13.779907599999998,
        longitude: 100.6296762,
      },
      placeId: "ChIJhQY0PQNiHTERtaA6LsBKTGo",
      maneuver: null,
    },
    {
      location: {
        latitude: 13.779966799999999,
        longitude: 100.62938179999999,
      },
      placeId: "ChIJ-QCLPQNiHTERYTluo9DdQe8",
      maneuver: null,
    },
    {
      location: {
        latitude: 13.7802621,
        longitude: 100.6278533,
      },
      originalIndex: 3,
      placeId: "ChIJNaYtDANiHTERX7RbDgY5RoE",
      maneuver: null,
    },
    {
      location: {
        latitude: 13.78025721093283,
        longitude: 100.62785256938574,
      },
      maneuver: null,
    },
  ],
};

const b = JSON.parse(JSON.stringify(a));

b.snappedPoints = b.snappedPoints.reverse();

console.log(a.snappedPoints[0]);
console.log(b.snappedPoints[0]);

const c = [...a.snappedPoints, ...b.snappedPoints];

console.log(c[0]);
console.log(c);
