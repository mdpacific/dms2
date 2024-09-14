console.log("Script is loaded and running.");

// Name of the database
const dbName = "FarmDB";

// Create or open the database
function openDatabase(callback) {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
        console.log("Database upgraded or created.");
    };

    request.onsuccess = function(event) {
        console.log("Database opened successfully.");
        callback(null, event.target.result); // Pass the database to the callback
    };

    request.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
        callback(event.target.error); // Pass the error to the callback
    };
}

// Create data
function createData(db, data, callback) {
    const transaction = db.transaction(["FarmData"], "readwrite");
    const store = transaction.objectStore("FarmData");
    const request = store.add(data);

    request.onsuccess = function(event) {
        console.log("Data added successfully.");
        callback(null, event.target.result); // Pass the ID of the added record to the callback
    };

    request.onerror = function(event) {
        console.error("Error adding data:", event.target.error);
        callback(event.target.error); // Pass the error to the callback
    };
}

// Read data
function readData(db, id, callback) {
    const transaction = db.transaction(["FarmData"], "readonly");
    const store = transaction.objectStore("FarmData");
    const request = store.get(id);

    request.onsuccess = function(event) {
        console.log("Data retrieved successfully.");
        callback(null, event.target.result); // Pass the retrieved data to the callback
    };

    request.onerror = function(event) {
        console.error("Error retrieving data:", event.target.error);
        callback(event.target.error); // Pass the error to the callback
    };
}

const sensorReadings = [20, 42.2];
const cropPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
const farmerNote = "Crops look healthy.";
const gpsCoordinates = 40.7128;
const timestamp = new Date();

// Example usage
openDatabase(function(error, db) {
    if (error) {
        console.error("Failed to open database:", error);
        return;
    }
    // Unit tests
    console.assert(typeof gpsCoordinates === "number", "invalid GPS coordinates");
    console.assert(Array.isArray(sensorReadings), "invalid sensor readings");
    console.assert(typeof cropPhoto === "string", "invalid photo");
    console.assert(typeof farmerNote === "string", "invalid farmer note");
    console.assert(timestamp instanceof Date, "invalid timestamp");


    // Create various types of data
    createData(db, {
        sensorReadings: sensorReadings,
        cropPhoto: cropPhoto,
        farmerNote: farmerNote,
        gpsCoordinates: gpsCoordinates,
        timestamp: timestamp
    }, function(error, id) {
        if (error) {
            console.error("Failed to create data:", error);
            return;
        }

        console.log("Data created with ID:", id);

        // Retrieve the data
        readData(db, id, function(error, data) {
            if (error) {
                console.error("Failed to retrieve data:", error);
            } else {
                console.log("Retrieved data:", data);
                
                // Display the image in the console (for debugging)
                if (data.image) {
                    const img = new Image();
                    img.src = data.image;
                    document.body.appendChild(img); // Add image to the body for visualization
                    console.log("Image data:", data.image);
                }

                // Display the rest of the data in the console
                console.log("Sensor Readings:", data.sensorReadings);
                console.log("Farmer Notes:", data.farmerNote);
                console.log("GPS Coordinates:", data.gpsCoordinates);
                console.log("Timestamp:", data.timestamp)
            }
        });
    });
});
