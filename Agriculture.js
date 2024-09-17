// Name of the database
const dbName = "AgricultureDB";

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

// Example usage
openDatabase(function(error, db) {
    if (error) {
        console.error("Failed to open database:", error);
        return;
    }

    // Create various types of data
    createData(db, {
        // Array: Sensor readings (e.g., temperature, humidity)
        sensorReadings: [23.5, 45.2], // Temperature: 23.5°C, Humidity: 45.2%

        // Image: Crop photos (Base64 encoded image string)
        cropPhoto: "C:\Apps\CropImg.jpeg", // Replace with actual Base64 string
    
        // String: Farmer notes and descriptions
        farmerNote: "Checked the crop health, observed some pest issues.",
    
        // Number: GPS coordinates (Latitude example)
        gpsCoordinates: 37.7749,
    
        // Date: Timestamp of data collection
        timestamp: new Date() // Current date and time
        
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
            }
        });
    });
});