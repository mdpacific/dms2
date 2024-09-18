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
        callback(null, event.target.result);
    };

    request.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
        callback(event.target.error);
    };
}

// Create data
function createData(db, data, callback) {
    const transaction = db.transaction(["FarmData"], "readwrite");
    const store = transaction.objectStore("FarmData");
    const request = store.add(data);

    request.onsuccess = function(event) {
        console.log("Data added successfully.");
        callback(null, event.target.result);
    };

    request.onerror = function(event) {
        console.error("Error adding data:", event.target.error);
        callback(event.target.error);
    };
}

// Read data
function readData(db, id, callback) {
    const transaction = db.transaction(["FarmData"], "readonly");
    const store = transaction.objectStore("FarmData");
    const request = store.get(id);

    request.onsuccess = function(event) {
        console.log("Data retrieved successfully.");
        callback(null, event.target.result);
    };

    request.onerror = function(event) {
        console.error("Error retrieving data:", event.target.error);
        callback(event.target.error);
    };
}

// Get all data
function getAllData(db, callback) {
    const transaction = db.transaction(["FarmData"], "readonly");
    const store = transaction.objectStore("FarmData");
    const request = store.getAll();

    request.onsuccess = function(event) {
        console.log("All data retrieved successfully.");
        callback(null, event.target.result);
    };

    request.onerror = function(event) {
        console.error("Error retrieving all data:", event.target.error);
        callback(event.target.error);
    };
}

// Test functions
function runTests() {
    openDatabase(function(error, db) {
        if (error) {
            console.error("Failed to open database:", error);
            return;
        }

        // Test 1: Create and read valid farm data
        function testCreateAndRead() {
            const testData = {
                sensorReadings: [22.5, 65.3],
                cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
                farmerNote: "Crops looking healthy",
                gpsCoordinates: [40.7128, -74.0060],
                timestamp: new Date().toISOString()
            };

            createData(db, testData, function(error, id) {
                if (error) {
                    console.error("Test 1 Failed: Could not create data", error);
                    return;
                }

                readData(db, id, function(error, retrievedData) {
                    if (error) {
                        console.error("Test 1 Failed: Could not read data", error);
                        return;
                    }

                    console.assert(JSON.stringify(testData) === JSON.stringify(retrievedData),
                        "Test 1 Failed: Data mismatch");
                    console.log("Test 1 Passed: Create and read successful");
                });
            });
        }

        // Test 2: Validate sensor readings
        function testSensorReadings() {
            createData(db, { sensorReadings: [22.5, 65.3] }, function(error, id) {
                if (error) {
                    console.error("Test 2 Failed: Valid sensor readings rejected", error);
                } else {
                    console.log("Test 2 Passed: Valid sensor readings accepted");
                }
            });

            createData(db, { sensorReadings: "not an array" }, function(error, id) {
                if (error) {
                    console.log("Test 2 Passed: Invalid sensor readings rejected");
                } else {
                    console.error("Test 2 Failed: Invalid sensor readings accepted");
                }
            });
        }

        // Test 3: Validate timestamp format
        function testTimestampFormat() {
            const validTimestamp = new Date().toISOString();
            createData(db, { timestamp: validTimestamp }, function(error, id) {
                if (error) {
                    console.error("Test 3 Failed: Valid timestamp rejected", error);
                } else {
                    console.log("Test 3 Passed: Valid timestamp accepted");
                }
            });

            const invalidTimestamp = "not a timestamp";
            createData(db, { timestamp: invalidTimestamp }, function(error, id) {
                if (error) {
                    console.log("Test 3 Passed: Invalid timestamp rejected");
                } else {
                    console.error("Test 3 Failed: Invalid timestamp accepted");
                }
            });
        }

        // Test 4: Validate GPS coordinates
        function testGPSCoordinates() {
            createData(db, { gpsCoordinates: [40.7128, -74.0060] }, function(error, id) {
                if (error) {
                    console.error("Test 4 Failed: Valid GPS coordinates rejected", error);
                } else {
                    console.log("Test 4 Passed: Valid GPS coordinates accepted");
                }
            });

            createData(db, { gpsCoordinates: "not an array" }, function(error, id) {
                if (error) {
                    console.log("Test 4 Passed: Invalid GPS coordinates rejected");
                } else {
                    console.error("Test 4 Failed: Invalid GPS coordinates accepted");
                }
            });
        }

        // Test 5: Validate crop photo data
        function testCropPhotoData() {
            const validPhotoData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
            createData(db, { cropPhoto: validPhotoData }, function(error, id) {
                if (error) {
                    console.error("Test 5 Failed: Valid crop photo data rejected", error);
                } else {
                    console.log("Test 5 Passed: Valid crop photo data accepted");
                }
            });

            const invalidPhotoData = "not a base64 image";
            createData(db, { cropPhoto: invalidPhotoData }, function(error, id) {
                if (error) {
                    console.log("Test 5 Passed: Invalid crop photo data rejected");
                } else {
                    console.error("Test 5 Failed: Invalid crop photo data accepted");
                }
            });
        }

        // Run all tests
        testCreateAndRead();
        testSensorReadings();
        testTimestampFormat();
        testGPSCoordinates();
        testCropPhotoData();

        // After tests, retrieve and log all data
        getAllData(db, function(error, allData) {
            if (error) {
                console.error("Failed to retrieve all data:", error);
            } else {
                console.log("All stored data:", allData);
            }
        });
    });
}

// Run the tests
runTests();