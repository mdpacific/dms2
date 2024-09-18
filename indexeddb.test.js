// Mocking the IndexedDB object with asynchronous behavior, adding validation for GPS
global.indexedDB = {
    open: jest.fn(() => {
        const request = {};
        setTimeout(() => {
            request.result = {
                createObjectStore: jest.fn(),
                transaction: jest.fn(() => ({
                    objectStore: jest.fn(() => ({
                        add: jest.fn((data) => {
                            const request = {};
                            setTimeout(() => {
                                // Validation: Check if GPS coordinates are valid
                                if (typeof data.gpsCoordinates === 'number') {
                                    if (request.onsuccess) request.onsuccess({ target: { result: data } });
                                } else {
                                    if (request.onerror) request.onerror({ target: { error: "Invalid GPS coordinates" } });
                                }
                            }, 100);
                            return request;
                        }),
                        get: jest.fn((key) => {
                            const request = {};
                            setTimeout(() => {
                                if (request.onsuccess) request.onsuccess({ target: { result: mockData[key] } });
                            }, 100);
                            return request;
                        })
                    }))
                }))
            };
            if (request.onupgradeneeded) request.onupgradeneeded({ target: request });
            if (request.onsuccess) request.onsuccess({ target: request });
        }, 100); // Simulating some delay for async behavior
        return request;
    })
};

// Mock data to simulate retrieval
const mockData = {
    1: {
        sensorReadings: [23.5, 45.2],
        cropPhoto: 'data:image/png;base64,iVBORw0KGgoAAA...',
        farmerNote: "Checked the crop health, observed some pest issues.",
        gpsCoordinates: 37.7749,
        timestamp: new Date()
    }
};

describe('AgricultureDB IndexedDB Tests', () => {
    let db;

    // Before all tests, open the database and create object store
    beforeAll((done) => {
        let request = indexedDB.open("AgricultureDB", 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            done();
        };

        request.onerror = function(event) {
            done.fail('Error opening the database');
        };
    }, 10000); // Setting the timeout for beforeAll to 10 seconds

    // Test 1: Check if the database is created successfully
    test('Should create AgricultureDB successfully', (done) => {
        expect(db).toBeDefined();
        done();
    }, 10000); // Setting the timeout for each test to 10 seconds

    // Test 2: Add valid data to the store and check success
    test('Should add valid data to FarmData store', (done) => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const store = transaction.objectStore("FarmData");

        const farmData = {
            sensorReadings: [23.5, 45.2], // Example sensor readings
            cropPhoto: 'data:image/png;base64,iVBORw0KGgoAAA...', // Example base64 image
            farmerNote: "Checked the crop health, observed some pest issues.",
            gpsCoordinates: 37.7749, // Example GPS coordinates
            timestamp: new Date() // Current timestamp
        };

        const request = store.add(farmData);

        request.onsuccess = function(event) {
            expect(event).toBeDefined();  // Check that the data was added successfully
            done();
        };

        request.onerror = function() {
            done.fail("Failed to add data to the store");
        };
    }, 10000); // Setting timeout to 10 seconds for this test

    // Test 3: Retrieve the added data and validate its correctness
    test('Should retrieve data correctly from FarmData store', (done) => {
        const transaction = db.transaction(["FarmData"], "readonly");
        const store = transaction.objectStore("FarmData");

        const request = store.get(1); // Assuming ID 1 is for the first entry

        request.onsuccess = function(event) {
            const result = event.target.result;
            expect(result.sensorReadings).toEqual([23.5, 45.2]);
            expect(result.cropPhoto).toBe('data:image/png;base64,iVBORw0KGgoAAA...');
            expect(result.farmerNote).toBe("Checked the crop health, observed some pest issues.");
            expect(result.gpsCoordinates).toBe(37.7749);
            expect(result.timestamp).toBeDefined();  // Ensure the timestamp exists
            done();
        };

        request.onerror = function() {
            done.fail("Failed to retrieve data from the store");
        };
    }, 10000); // Setting timeout to 10 seconds for this test

    // Test 4: Check auto-incrementing key for multiple entries
    test('Should auto-increment key for each new entry', (done) => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const store = transaction.objectStore("FarmData");

        const newFarmData = {
            sensorReadings: [24.2, 50.1], // Example sensor readings
            cropPhoto: 'data:image/png;base64,iVBORw0KGgoAAA...', // Example base64 image
            farmerNote: "Regular inspection, no issues found +1.",
            gpsCoordinates: 37.7749, // Example GPS coordinates
            timestamp: new Date() // Current timestamp
        };

        const request = store.add(newFarmData);

        request.onsuccess = function(event) {
            expect(event.target.result).toBeDefined();  // Auto-incremented key should exist
            done();
        };

        request.onerror = function() {
            done.fail("Failed to add new entry to the store");
        };
    }, 10000); // Setting timeout to 10 seconds for this test

    // Test 5: Ensure invalid GPS data (non-numeric) is not added to FarmData store
    test('Should not add invalid GPS data (non-numeric)', (done) => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const store = transaction.objectStore("FarmData");

        const invalidData = {
            sensorReadings: [20.1, 35.7], // Example sensor readings
            cropPhoto: 'data:image/png;base64,iVBORw0KGgoAAA...', // Example base64 image
            farmerNote: "Invalid GPS data",
            gpsCoordinates: "invalidGPS", // Invalid GPS coordinates (non-numeric)
            timestamp: new Date() // Current timestamp
        };

        const request = store.add(invalidData);

        request.onsuccess = function() {
            done(new Error("Invalid GPS data should not have been added"));
        };

        request.onerror = function(event) {
            expect(event).toBeDefined();  // Expect an error when trying to add invalid data
            done();
        };
    }, 10000); // Setting timeout to 10 seconds for this test
});
