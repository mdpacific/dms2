// Array: Sensor readings (e.g., temperature, humidity)
const sensorReadings = [23.5, 45.2]; // Temperature: 23.5°C, Humidity: 45.2%

// Image: Crop photos (Base64 encoded image string)
const cropPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";

// String: Farmer notes and descriptions
const farmerNote = "Checked the crop health, observed some pest issues.";

// Number: GPS coordinates (Latitude example)
const gpsCoordinates = 37.7749;

// Date: Timestamp of data collection
const timestamp = new Date(); // Current date and time

console.log(sensorReadings, cropPhoto, farmerNote, gpsCoordinates, timestamp);

// IndexedDB Setup
let db;
let request = indexedDB.open("AgricultureDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("sensorReadings", "sensorReadings", { unique: false });
    objectStore.createIndex("cropPhoto", "cropPhoto", { unique: false });
    objectStore.createIndex("farmerNote", "farmerNote", { unique: false });
    objectStore.createIndex("gpsCoordinates", "gpsCoordinates", { unique: false });
    objectStore.createIndex("timestamp", "timestamp", { unique: false });
};

request.onsuccess = async function(event) {
    db = event.target.result;
    let transaction = db.transaction(["FarmData"], "readwrite");
    let objectStore = transaction.objectStore("FarmData");
    let data = {
        sensorReadings: [23.5, 45.2],
        cropPhoto: "data:image/png;base64,iVBORw0KGgoAAA...",
        farmerNote: "Checked the crop health, observed some pest issues.",
        gpsCoordinates: 37.7749,
        timestamp: new Date()
    };

    await new Promise((resolve, reject) => {
        let addRequest = objectStore.add(data);
        addRequest.onsuccess = () => {
            console.log("Data added to IndexedDB");
            resolve();
        };
        addRequest.onerror = reject;
    });

    let retrievedData = await new Promise((resolve, reject) => {
        let getAllRequest = objectStore.getAll();
        getAllRequest.onsuccess = (event) => {
            resolve(event.target.result);
        };
        getAllRequest.onerror = reject;
    });

    console.log("Retrieved data:", retrievedData);
};

// Export variables for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sensorReadings, cropPhoto, farmerNote, gpsCoordinates, timestamp };
}
