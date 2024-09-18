// JavaScript Code to Set Up IndexedDB, Store, and Retrieve Data

// Open or create IndexedDB database and object store
let request = indexedDB.open('AgricultureDB', 1);

request.onupgradeneeded = function(event) {
    let db = event.target.result;

    // Create object store with auto-incrementing primary key
    let objectStore = db.createObjectStore('FarmData', { autoIncrement: true });

    // Define indexes for object store (optional)
    objectStore.createIndex('sensorReadings', 'sensorReadings', { unique: false });
    objectStore.createIndex('cropPhoto', 'cropPhoto', { unique: false });
    objectStore.createIndex('farmerNote', 'farmerNote', { unique: false });
    objectStore.createIndex('gpsCoordinates', 'gpsCoordinates', { unique: false });
    objectStore.createIndex('timestamp', 'timestamp', { unique: false });

    console.log("Database and object store created.");
};

request.onsuccess = function(event) {
    console.log("Database opened successfully.");
    storeData(); // Call function to store data once database is opened
    // After storing, retrieve and log the data
    setTimeout(retrieveData, 1000); // Delay to ensure data is stored before retrieval
};

request.onerror = function(event) {
    console.error("Error opening database:", event.target.error);
};

// Function to store data in IndexedDB
function storeData() {
    let request = indexedDB.open('AgricultureDB', 1);
    
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(['FarmData'], 'readwrite');
        let objectStore = transaction.objectStore('FarmData');
        
        // Sample data to store
        let data = {
            sensorReadings: [25.3, 60.7],
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...", // Shortened for brevity
            farmerNote: "Observed good growth, but some areas are dry.",
            gpsCoordinates: 40.7128,
            timestamp: new Date()
        };

        // Add data to object store
        let requestAdd = objectStore.add(data);

        requestAdd.onsuccess = function() {
            console.log("Data stored successfully.");
        };

        requestAdd.onerror = function(event) {
            console.error("Error storing data:", event.target.error);
        };
    };

    request.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
    };
}

// Function to retrieve and log data from IndexedDB
function retrieveData() {
    let request = indexedDB.open('AgricultureDB', 1);
    
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(['FarmData'], 'readonly');
        let objectStore = transaction.objectStore('FarmData');
        
        // Open a cursor to iterate through all records
        let cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function(event) {
            let cursor = event.target.result;

            if (cursor) {
                let data = cursor.value;
                
                // Log the data to the console
                console.log("Sensor Readings:", data.sensorReadings); // Array
                console.log("Crop Photo (Base64 String):", data.cropPhoto); // Image as Base64 string
                console.log("Farmer Note:", data.farmerNote); // String
                console.log("GPS Coordinates:", data.gpsCoordinates); // Number
                console.log("Timestamp:", data.timestamp); // Date

                // Move to the next record
                cursor.continue();
            } else {
                console.log("No more entries.");
            }
        };

        cursorRequest.onerror = function(event) {
            console.error("Error retrieving data:", event.target.error);
        };
    };

    request.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
    };
}
