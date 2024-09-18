const DB_NAME = "AgriDataDB";
const STORE_NAME = "FieldRecords";

// Function to open IndexedDB
function initializeDatabase(onSuccessCallback) {
    const dbRequest = indexedDB.open(DB_NAME, 1);

    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "recordId", autoIncrement: true });

        // Defining indexes
        objectStore.createIndex("sensorReadings", "sensorReadings", { unique: false });
        objectStore.createIndex("cropImages", "cropImages", { unique: false });
        objectStore.createIndex("farmerNote", "farmerNote", { unique: false });
        objectStore.createIndex("gpsCoordinates", "gpsCoordinates", { unique: false });
        objectStore.createIndex("timeStamp", "timeStamp", { unique: false });
        
        console.log("Database schema created successfully.");
    };

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        console.log("Database connection established.");
        onSuccessCallback(db);  // Proceed with database operations
    };

    dbRequest.onerror = (event) => {
        console.error("Error opening database:", event.target.error);
    };
}

// Function to add a record to IndexedDB
function addRecord(db) {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);

    const newRecord = {
        sensorReadings: [[21.8, 43.6]],  // Example data for sensor readings
        cropImages: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA.../", // Example image data
        farmerNote: "Noticed a slight decrease in soil moisture, irrigation needed.",
        gpsCoordinates: [[-45.987, 120.456]],  // Example GPS coordinates
        timeStamp: new Date()  // Current timestamp
    };

    const addRequest = objectStore.add(newRecord);

    addRequest.onsuccess = () => {
        console.log("Record added to the database.");
        retrieveAllRecords(db);  // Fetch data after addition
    };

    addRequest.onerror = (event) => {
        console.error("Error adding record:", event.target.error);
    };
}

// Function to retrieve all records from IndexedDB
function retrieveAllRecords(db) {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);

    const fetchRequest = objectStore.getAll();

    fetchRequest.onsuccess = (event) => {
        const records = event.target.result;
        console.log("Records fetched from IndexedDB:", records);

        records.forEach(record => {
            console.log(`ID: ${record.recordId}`);
            console.log(`Sensor Readings: ${record.sensorReadings}`);
            console.log(`Crop Images: ${record.cropImages}`);
            console.log(`Farmer Note: ${record.farmerNote}`);
            console.log(`GPS Coordinates: ${record.gpsCoordinates}`);
            console.log(`Timestamp: ${record.timeStamp}`);

            // Optionally display the image on the page
            const imgElement = new Image();
            imgElement.src = record.cropImages;
            document.body.appendChild(imgElement);
        });
    };

    fetchRequest.onerror = (event) => {
        console.error("Error fetching records:", event.target.error);
    };
}

// Initialize the database and add a record
initializeDatabase((db) => {
    addRecord(db);  // Add data once the database is initialized
});

// Export for use in other modules
module.exports = {
    sensorReadings,
    cropImages,
    farmerNote,
    gpsCoordinates,
    timeStamp
};
