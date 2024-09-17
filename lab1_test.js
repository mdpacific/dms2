// Sample data
let sensorReadings = [23.5, 45.2];  // Array: Sensor readings (e.g., temperature, humidity)
let cropPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";  // Image: Crop photos (Base64)
let farmerNote = "Checked the crop health, observed some pest issues.";  // String: Farmer notes
let gpsCoordinates = 37.7749;  // Number: GPS coordinates (Latitude)
let timestamp = new Date();  // Date: Timestamp of data collection

// Test Case 1: Check if sensorReadings is an array and contains valid values
function testSensorReadings() {
    if (Array.isArray(sensorReadings)) {
        console.log("Test 1: Passed - sensorReadings is an array.");
        if (sensorReadings.length === 2) {
            console.log("Test 1: Passed - sensorReadings has 2 elements.");
        } else {
            console.log("Test 1: Failed - sensorReadings should have 2 elements.");
        }
    } else {
        console.log("Test 1: Failed - sensorReadings is not an array.");
    }
}

// Test Case 2: Check if cropPhoto is a valid Base64 image string
function testCropPhoto() {
    if (typeof cropPhoto === "string" && cropPhoto.startsWith("data:image")) {
        console.log("Test 2: Passed - cropPhoto is a valid Base64 image string.");
    } else {
        console.log("Test 2: Failed - cropPhoto is not a valid Base64 image string.");
    }
}

// Test Case 3: Check if farmerNote is a valid string
function testFarmerNote() {
    if (typeof farmerNote === "string") {
        console.log("Test 3: Passed - farmerNote is a string.");
    } else {
        console.log("Test 3: Failed - farmerNote is not a string.");
    }
}

// Test Case 4: Check if gpsCoordinates is a number
function testGPSCoordinates() {
    if (typeof gpsCoordinates === "number") {
        console.log("Test 4: Passed - gpsCoordinates is a number.");
    } else {
        console.log("Test 4: Failed - gpsCoordinates is not a number.");
    }
}

// Test Case 5: Check if timestamp is a valid Date object
function testTimestamp() {
    if (timestamp instanceof Date && !isNaN(timestamp.getTime())) {
        console.log("Test 5: Passed - timestamp is a valid Date.");
    } else {
        console.log("Test 5: Failed - timestamp is not a valid Date.");
    }
}

// Function to run all tests
function runAllTests() {
    console.log("Running all tests...");
    testSensorReadings();
    testCropPhoto();
    testFarmerNote();
    testGPSCoordinates();
    testTimestamp();
    console.log("All tests completed.");
}

// Run all the tests
runAllTests();
