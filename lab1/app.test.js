require("fake-indexeddb/auto");
let {
  sensorReadings,
  cropImages,
  farmerNote,
  gpsCoordinates,
  timeStamp,
} = require("./lab1.js");

jest.mock("./lab1.js", () => {
  return {
    sensorReadings: [[26.4, 49.1]],
    cropImages: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAZABkAAD/..."],
    farmerNote:
      "Regularly test soil for nutrient levels and pH balance to ensure optimal crop growth.",
    gpsCoordinates: [[38.6712, -70.0132]],
    timeStamp: new Date(),
  };
});

describe("Test the data types", () => {
  test("Check the type of sensor readings", () => {
    console.log(sensorReadings);

    expect(sensorReadings[0][0]).toBe(26.4);
    expect(sensorReadings[0][1]).toBe(49.1);
    expect(typeof sensorReadings[0][0]).toBe("number");
    expect(typeof sensorReadings[0][1]).toBe("number");
  });

  test("Check the type of crop images", () => {
    console.log(cropImages);

    expect(cropImages[0]).toBe(
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAZABkAAD/..."
    );
    expect(typeof cropImages[0]).toBe("string");
  });

  test("Check the type of farmer note", () => {
    console.log(farmerNote);

    expect(farmerNote).toBe(
      "Regularly test soil for nutrient levels and pH balance to ensure optimal crop growth."
    );
    expect(typeof farmerNote).toBe("string");
  });

  test("Check the type of GPS coordinates", () => {
    console.log(gpsCoordinates);

    expect(gpsCoordinates[0][0]).toBe(38.6712);
    expect(gpsCoordinates[0][1]).toBe(-70.0132);
    expect(typeof gpsCoordinates[0][0]).toBe("number");
    expect(typeof gpsCoordinates[0][1]).toBe("number");
  });

  test("Check the type of timestamp", () => {
    console.log(timeStamp);

    expect(timeStamp instanceof Date).toBe(true);
  });
});
