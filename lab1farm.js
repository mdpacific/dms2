// Array: Sensor readings (e.g., temperature, humidity)
let sensorReadings = [23.5, 45.2]; // Temperature: 23.5°C, Humidity: 45.2%

// Image: Crop photos (Base64 encoded image string)
let cropPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";

// String: Farmer notes and descriptions
let farmerNote = "Checked the crop health, observed some pest issues.";

// Number: GPS coordinates (Latitude example)
let gpsCoordinates = 37.7749;

// Date: Timestamp of data collection
let timestamp = new Date(); // Current date and time

// Set up IndexedDB
let db;
let request = indexedDB.open("AgricultureDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("FarmData", { autoIncrement: true });
    objectStore.createIndex("sensorReadings", "sensorReadings", { unique: false });
    objectStore.createIndex("cropPhoto", "cropPhoto", { unique: false });
    objectStore.createIndex("farmerNote", "farmerNote", { unique: false });
    objectStore.createIndex("gpsCoordinates", "gpsCoordinates", { unique: false });
    objectStore.createIndex("timestamp", "timestamp", { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    storeData();
};

function storeData() {
    let transaction = db.transaction(["FarmData"], "readwrite");
    let objectStore = transaction.objectStore("FarmData");

    let data = {
        sensorReadings: [23.5, 45.2], // Example array
        cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
        farmerNote: "Checked the crop health, observed some pest issues.",
        gpsCoordinates: 37.7749,
        timestamp: new Date()
    };

    let request = objectStore.add(data);

    request.onsuccess = function(event) {
        console.log("Data has been added to your database.");
    };

    request.onerror = function(event) {
        console.log("Unable to add data due to an error.");
    };
}

function retrieveData() {
    let transaction = db.transaction(["FarmData"], "readonly");
    let objectStore = transaction.objectStore("FarmData");

    let request = objectStore.getAll();

    request.onsuccess = function(event) {
        let allRecords = event.target.result;
        
        if (allRecords.length > 0) {
            console.log("Retrieved Data:");
            allRecords.forEach((record, index) => {
                console.log('Record ${index + 1}:');
                console.log("Sensor Readings:", record.sensorReadings);
                console.log("Crop Photo:", record.cropPhoto);
                console.log("Farmer Note:", record.farmerNote);
                console.log("GPS Coordinates:", record.gpsCoordinates);
                console.log("Timestamp:", record.timestamp);
                console.log("-------------------------------");
            });
        } else {
            console.log("No records found.");
        }
    };

    request.onerror = function(event) {
        console.log("Unable to retrieve data. Error:", event.target.error);
    };
}

// Call retrieveData after a delay to allow the data to be stored
setTimeout(retrieveData, 2000);