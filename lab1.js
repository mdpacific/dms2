// Configuration for IndexedDB
const DB_NAME = "AgricultureDB";
const OBJECT_STORE_NAME = "FarmData";

// Function to open IndexedDB
function openDB(callback) {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        const store = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id", autoIncrement: true });
        // Creating indexes for all the fields
        store.createIndex("sensorReadings", "sensorReadings", { unique: false });
        store.createIndex("cropPhoto", "cropPhoto", { unique: false });
        store.createIndex("farmerNote", "farmerNote", { unique: false });
        store.createIndex("gpsCoordinates", "gpsCoordinates", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });

        console.log("Object store and indexes created.");
    };
    request.onsuccess = function(event) {
        const db = event.target.result;
        console.log("Database opened successfully.");
        callback(db);  // Proceed with DB operations
    };

    request.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
    };
}
// Function to add data to IndexedDB
function addData(db) {
    const transaction = db.transaction([OBJECT_STORE_NAME], "readwrite");
    const store = transaction.objectStore(OBJECT_STORE_NAME);

    const data = {
        sensorReadings: [
            [25.4, 60.3],
            [22.8, 55.1]
        ],  // Array of readings: Temperature and Humidity
        cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",  // Base64 encoded PNG image
        farmerNote: "Watering required due to dry conditions.",  // Farmer's note
        gpsCoordinates: [-34.397, 150.644],  // GPS coordinates (Latitude and Longitude)
        timestamp: new Date("2023-09-10T10:20:30Z")  // Fixed timestamp
    };

    const request = store.add(data);

    request.onsuccess = function() {
        console.log("Data added to IndexedDB.");
        fetchData(db);  // Fetch data after successful addition
    };

    request.onerror = function(event) {
        console.error("Error adding data:", event.target.error);
    };
}

// Function to fetch data from IndexedDB
function fetchData(db) {
    const transaction = db.transaction([OBJECT_STORE_NAME], "readonly");
    const store = transaction.objectStore(OBJECT_STORE_NAME);

    const request = store.getAll();

    request.onsuccess = function(event) {
        const records = event.target.result;
        console.log("Fetched records from IndexedDB:");
        records.forEach(record => {
            console.log("ID:", record.id);
            console.log("Sensor Readings:", record.sensorReadings);
            console.log("Crop Photo:", record.cropPhoto);
            console.log("Farmer Note:", record.farmerNote);
            console.log("GPS Coordinates:", record.gpsCoordinates);
            console.log("Timestamp:", record.timestamp);

            // Optionally, display the image
            const img = new Image();
            img.src = record.cropPhoto;
            document.body.appendChild(img);
        });
    };

    request.onerror = function(event) {
        console.error("Error fetching data:", event.target.error);
    };
}

// Initialize the database operations
openDB(function(db) {
    addData(db);  // Start with adding data
});

module.exports = {
    sensorReadings: [
        [25.4, 60.3],
        [22.8, 55.1]
    ],
    cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",  // Placeholder Base64 image
    farmerNote: "Watering required due to dry conditions.",
    gpsCoordinates: [-34.397, 150.644],
    timestamp: new Date("2023-09-10T10:20:30Z")
};
