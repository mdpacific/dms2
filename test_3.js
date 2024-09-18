// Array: Sensor readings (e.g., temperature, humidity)
let sensorReadings = [23.5, 45.2]; // Temperature: 23.5°C, Humidity: 45.2%

// Image: Crop photos (Base64 encoded image string)
let cropPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";

// String: Farmer notes and descriptions
let farmerNote = "Checked the crop health, observed some pest issues.";

// Number: GPS coordinates (Latitude example)
let gpsCoordinates = 37.7749;

// Date: Timestamp of data collection
let timestamp = new Date(); // Current date and time

let request = indexedDB.open("AgricultureDB");
request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(["FarmData"],"readwrite");
    let FarmDataOs = transaction.objectStore("FarmData");

    FarmDataOs.add({UUID: crypto.randomUUID(), sensorReadings, cropPhoto, farmerNote, gpsCoordinates, timestamp});
    let getRequest = FarmDataOs.get(1);
    getRequest.onsuccess = (event) => {
        let storedFarmData = event.target.result;
        console.log("Retrieved data from FarmData: ");
        console.log("Sensor Readings: ", sensorReadings);
        console.log("Crop Photo: ", cropPhoto);
        console.log("Farmer Note: ", farmerNote);
        console.log("GPS Coordinates: ", gpsCoordinates);
        console.log("Timestamp: ",timestamp);
    };
};

request.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore("FarmData", {keyPath:"id", autoIncrement: true});
};

request.onerror = function(event) {
    console.log("failed to open AgricultureDB");
};