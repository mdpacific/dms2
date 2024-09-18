// const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;

// Array: Sensor readings (e.g., temperature, humidity)
let sensorReading = [23.5, 45.2]; // Temperature: 23.5°C, Humidity: 45.2%

// Image: Crop photos (Base64 encoded image string)
let cropPhoto = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."];

// String: Farmer notes and descriptions
let farmerNote = "Checked the crop health, observed some pest issues.";

// Number: GPS coordinates (Latitude example)
let gpsCoordinate = [37.7749, 24.3230];

// Date: Timestamp of data collection
let timestamp = new Date(); // Current date and time

const request = indexedDB.open("AgricultureDB", 1); // Version: 1

request.onerror = (event) => {
  console.error("Error: ", event.target.errorCode);
};

request.onsuccess = (event) => {
  let db = event.target.result;
  console.log("Database opened successfully");

  const transaction = db.transaction(["FarmData"], "readwrite");
  const farmstore = transaction.objectStore("FarmData");

  farmstore.add({sensorReading, cropPhoto, farmerNote, gpsCoordinate, timestamp });

  const getRequest = farmstore.get(1); 

  getRequest.onsuccess = (event) => {
    let farmDataRequest = event.target.result;
    if (farmDataRequest) { 
      console.log("Data retrieved successfully:");
      console.log("  UUID:", farmDataRequest.uuid);
      console.log("  Sensor Readings:", farmDataRequest.sensorReading[0],"\u2103, " ,farmDataRequest.sensorReading[1], "% | Type:", typeof farmDataRequest.sensorReading);
      console.log("  Crop Image (Base64):", farmDataRequest.cropPhoto[0], " | Type:", typeof farmDataRequest.cropPhoto);
      console.log("  Farmer Note:", farmDataRequest.farmerNote, " | Type:", typeof farmDataRequest.farmerNote);
      console.log("  GPS Coordinates:", "Latitude:", farmDataRequest.gpsCoordinate[0],"Longitude:", farmDataRequest.gpsCoordinate[1], " | Type:", typeof farmDataRequest.gpsCoordinate); // Access first element (latitude)
      console.log("  Timestamp:", farmDataRequest.timestamp, " | Type:", farmDataRequest.timestamp instanceof Date ? "Date" : "Not a Date");
    } else {
      console.log("No data found with the generated UUID.");
    }
  };

  getRequest.onerror = (event) => {
    console.error("Error retrieving data:", event.target.errorCode);
  };

  transaction.onerror = (event) => {
    console.error("Transaction Error:", event.target.errorCode);
  };

  transaction.oncomplete = (event) => {
    console.log("All done!");
    db.close();
  };
};

request.onupgradeneeded = (event) => {
  let db = event.target.result;
  console.log("onupgradeneeded triggered, creating object stores.");

  const farmstore = db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
  // Indexes are not necessary for this basic implementation, but can be added for searching
  farmstore.createIndex("sensorReading", "sensorReading", { unique: false });
  farmstore.createIndex("cropPhoto", "cropPhoto", { unique: false });
  farmstore.createIndex("farmerNote", "farmerNote", { unique: false });
  farmstore.createIndex("gpsCoordinate", "gpsCoordinate", { unique: false });
  farmstore.createIndex("timestamp", "timestamp", { unique: false });
};
