let db;

// Step 1: Open or create the IndexedDB database
const dbRequest = indexedDB.open("AgricultureDB", 1);

dbRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("sensorReadings", "sensorReadings", { unique: false });
    objectStore.createIndex("cropPhoto", "cropPhoto", { unique: false });
    objectStore.createIndex("farmerNote", "farmerNote", { unique: false });
    objectStore.createIndex("gpsCoordinates", "gpsCoordinates", { unique: false });
    objectStore.createIndex("timestamp", "timestamp", { unique: false });
};

dbRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully.");

    // Retrieve and log stored data
    retrieveAndLogData();
};

// Step 2: Retrieve stored data from IndexedDB
function retrieveAndLogData() {
    const transaction = db.transaction(["FarmData"], "readonly");
    const objectStore = transaction.objectStore("FarmData");

    objectStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;

        if (cursor) {
            const data = cursor.value;

            // Log all data types in a formatted manner
            console.log("Retrieved Data:");
            console.log("Sensor Readings (Array):", data.sensorReadings);  // Array of sensor readings
            console.log("Crop Photo (Base64):", data.cropPhoto);  // Base64 encoded string for the image
            console.log("Farmer Note (String):", data.farmerNote);  // String
            console.log("GPS Coordinates (Number):", data.gpsCoordinates);  // Number for coordinates
            console.log("Timestamp (Date):", new Date(data.timestamp).toLocaleString());  // Date formatted

            cursor.continue();  // Move to the next item if available
        } else {
            console.log("All data retrieved and logged.");
        }
    };
}

