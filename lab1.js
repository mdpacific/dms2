let request = indexedDB.open("AgricultureDB", 1);

request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(["FarmData"], "readonly");
    let objectStore = transaction.objectStore("FarmData");
    let getRequest = objectStore.getAll();

    getRequest.onsuccess = function(event) {
        console.log("Data retrieved from the database:", event.target.result);
    };

    getRequest.onerror = function(event) {
        console.error("Error retrieving data:", event.target.error);
    };
};

request.onerror = function(event) {
    console.error("Error opening database:", event.target.error);
};

function retrieveData() {
    let request = indexedDB.open("AgricultureDB", 1);

    request.onsuccess = (event) => {
        let db = event.target.result;
        let transaction = db.transaction(["FarmData"], "readonly");
        let objectStore = transaction.objectStore("FarmData");

        let getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            console.log("Retrieved data:", getAllRequest.result);
        };
    };

    request.onerror = (event) => {
        console.log("Error: " + event.target.errorCode);
    };
}

// Call the retrieve function to log data
retrieveData();

function retrieveAndPrintData() {
    let request = indexedDB.open("AgricultureDB", 1);

    request.onsuccess = (event) => {
        let db = event.target.result;
        let transaction = db.transaction(["FarmData"], "readonly");
        let objectStore = transaction.objectStore("FarmData");

        let getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            let farmData = getAllRequest.result;
            if (farmData.length > 0) {
                console.log("Retrieved Data from IndexedDB:");
                farmData.forEach((entry, index) => {
                    console.log('Entry ${index + 1}:');
                    console.log("Sensor Readings:", entry.sensorReadings);
                    console.log("Crop Photo (Base64):", entry.cropPhoto);
                    console.log("Farmer Note:", entry.farmerNote);
                    console.log("GPS Coordinates:", entry.gpsCoordinates);
                    console.log("Timestamp:", entry.timestamp);
                });
            } else {
                console.log("No data found in 'FarmData' store.");
            }
        };

        getAllRequest.onerror = () => {
            console.log("Error retrieving data from 'FarmData'.");
        };
    };

    request.onerror = (event) => {
        console.log("Error opening IndexedDB: " + event.target.errorCode);
    };
}

// Call the function to retrieve and print the data
retrieveAndPrintData();
