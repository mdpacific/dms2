// Open or create IndexedDB database
let request = indexedDB.open("AgricultureDB", 1);

request.onupgradeneeded = function(event) {
    let db = event.target.result;
    let objectStore = db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("sensorReadings", "sensorReadings", { unique: false });
    objectStore.createIndex("cropPhoto", "cropPhoto", { unique: false });
    objectStore.createIndex("farmerNote", "farmerNote", { unique: false });
    objectStore.createIndex("gpsCoordinates", "gpsCoordinates", { unique: false });
    objectStore.createIndex("timestamp", "timestamp", { unique: false });
    console.log("Database setup complete.");
};

request.onsuccess = function(event) {
    let db = event.target.result;
    console.log("Database opened successfully.");

    let transaction = db.transaction(["FarmData"], "readwrite");
    let objectStore = transaction.objectStore("FarmData");

    // Data to store
    let sensorReadings = [[39.5, 42.5]];
    let cropPhoto = "data:image/jpeg;base64,/iVBORw0KGgoAAAANSUhEUgAAA/...";
    let farmerNote = "Need to irrigate more due to dry conditions.";
    let gpsCoordinates = [[-46.45313, 54.49337]];
    let timestamp = new Date();

    // Add data to IndexedDB
    let data = {
        sensorReadings: sensorReadings,
        cropPhoto: cropPhoto,
        farmerNote: farmerNote,
        gpsCoordinates: gpsCoordinates,
        timestamp: timestamp
    };

    let addRequest = objectStore.add(data);

    addRequest.onsuccess = function() {
        console.log("Data added to IndexedDB successfully!");

        // Retrieve data from IndexedDB
        let transaction = db.transaction(["FarmData"], "readonly");
        let objectStore = transaction.objectStore("FarmData");

        // Get all records from the object store
        let getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function() {
            let records = getAllRequest.result;
            console.log("Retrieved records from IndexedDB:");

            records.forEach(record => {
                console.log("ID:", record.id);
                console.log("Sensor Readings:", record.sensorReadings);
                console.log("Crop Photo:", record.cropPhoto); // Base64 image data
                console.log("Farmer Note:", record.farmerNote);
                console.log("GPS Coordinates:", record.gpsCoordinates);
                console.log("Timestamp:", record.timestamp);

                // Optionally, you can format the Base64 image data if needed
                let img = new Image();
                img.src = record.cropPhoto;
                document.body.appendChild(img);
            });
        };

        getAllRequest.onerror = function() {
            console.error("Error retrieving data from IndexedDB:", getAllRequest.error);
        };
    };

    addRequest.onerror = function() {
        console.error("Error adding data to IndexedDB:", addRequest.error);
    };
};

request.onerror = function(event) {
    console.error("Error opening IndexedDB:", event.target.error);
};
