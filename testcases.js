// Open IndexedDB
let db;
const request = indexedDB.open("AgricultureDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("FarmData")) {
        db.createObjectStore("FarmData", { autoIncrement: true });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    storeData();
};

function storeData() {
    let transaction = db.transaction(["FarmData"], "readwrite");
    let store = transaction.objectStore("FarmData");

    // Sample Data
    let data = {
        sensorReadings: [23.5, 45.2],
        cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
        farmerNote: "Checked the crop health, observed some pest issues.",
        gpsCoordinates: 37.7749,
        timestamp: new Date().toISOString()
    };

    let request = store.add(data);

    request.onsuccess = function() {
        console.log("Data stored successfully.");
        retrieveData();
    };

    request.onerror = function(event) {
        console.error("Error storing data: ", event.target.error);
    };
}

function retrieveData() {
    let transaction = db.transaction(["FarmData"]);
    let store = transaction.objectStore("FarmData");

    let request = store.getAll();

    request.onsuccess = function(event) {
        const data = event.target.result;

        if (data.length > 0) {
            console.log("Data retrieved successfully.");

            // Logging each field with success messages
            data.forEach(entry => {
                console.log("Sensor Readings: ", entry.sensorReadings);
                console.log("Success: Sensor readings logged.");

                console.log("Crop Photo (Base64): ", entry.cropPhoto);
                console.log("Success: Crop photo logged.");

                console.log("Farmer Note: ", entry.farmerNote);
                console.log("Success: Farmer note logged.");

                console.log("GPS Coordinates: ", entry.gpsCoordinates);
                console.log("Success: GPS coordinates logged.");

                console.log("Timestamp: ", entry.timestamp);
                console.log("Success: Timestamp logged.");
            });
        } else {
            console.log("No data found.");
        }
    };

    request.onerror = function(event) {
        console.error("Error retrieving data: ", event.target.error);
    };
}