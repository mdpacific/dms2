// Test if the sensor readings are stored as an array
function testSensorReadings(data) {
    console.assert(Array.isArray(data.sensorReadings), "Sensor readings should be an array.");
}

// Test if the crop photo is stored as a base64 string
function testCropPhoto(data) {
    console.assert(typeof data.cropPhoto === 'string' && data.cropPhoto.startsWith('data:image'), "Crop photo should be a base64 image string.");
}

// Test if the farmer note is a string
function testFarmerNote(data) {
    console.assert(typeof data.farmerNote === 'string', "Farmer note should be a string.");
}

// Test if the GPS coordinates are a number
function testGpsCoordinates(data) {
    console.assert(typeof data.gpsCoordinates === 'number', "GPS coordinates should be a number.");
}

// Test if the timestamp is a valid Date object
function testTimestamp(data) {
    console.assert(data.timestamp instanceof Date, "Timestamp should be a Date object.");
}

// Running the tests on retrieved data
function runTests() {
    let transaction = db.transaction(["FarmData"], "readonly");
    let objectStore = transaction.objectStore("FarmData");

    let request = objectStore.getAll();
    request.onsuccess = function(event) {
        let data = event.target.result[0]; // Assuming the first entry

        // Running all test functions
        testSensorReadings(data);
        testCropPhoto(data);
        testFarmerNote(data);
        testGpsCoordinates(data);
        testTimestamp(data);
        
        console.log("All tests passed!");
    };
}

// Run tests after retrieving data
setTimeout(runTests, 4000);