require('fake-indexeddb/auto');
const { sensorReading, cropPhoto, farmerNote, gpsCoordinate, timeStamp } = require('./app.js');
jest.mock('./app.js', () => {
    return {
        sensorReading: [[23.5, 45.2]],
        cropPhoto: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAZABkAAD/..."],
        farmerNote: "Checked the crop health, observed some pest issues.",
        gpsCoordinate: [[40.7128, -74.0060]],
        timeStamp: new Date()
    };
});
let db;

// Setup before each test
beforeEach(() => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AgricultureDB", 1);
    
    request.onerror = (event) => {
      console.error("Error: ", event.target.errorCode);
      reject("Error opening IndexedDB");
    };
    
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully");
      resolve();
    };
    
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore('FarmData', { autoIncrement: true });
    };
  });
});

// Test opening the database
test('should open the AgricultureDB database', () => {
  expect(db).toBeDefined();
});

// Test adding data to the database
test('should add data to the FarmData object store', async () => {
  const transaction = db.transaction(['FarmData'], 'readwrite');
  const farmstore = transaction.objectStore('FarmData');
  
  const data = {
    sensorReading,
    cropPhoto,
    farmerNote,
    gpsCoordinate,
    timeStamp,
  };
  
  const request = farmstore.add(data);
  
  await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.errorCode);
  });

  expect(request.result).toBeDefined();
});

// Test retrieving data from the database
test('Should retrieve data correctly from FarmData store', (done) => {
    let db = event.target.result;
    console.log("Database opened successfully");

    const transaction = db.transaction(["FarmData"], "readwrite");
    const farmstore = transaction.objectStore("FarmData");

    farmstore.add({sensorReading, cropPhoto, farmerNote, gpsCoordinate, timestamp });

    const getRequest = farmstore.get(1); 

    getRequest.onsuccess = (event) => {
        let result = event.target.result;
        expect(result.sensorReadings).toEqual([23.5, 45.2]);
        expect(result.cropPhoto).toBe('data:image/png;base64,iVBORw0KGgoAAA...');
        expect(result.farmerNote).toBe("Checked the crop health, observed some pest issues.");
        expect(result.gpsCoordinates).toBe([37.7749, 24.3230]);
        expect(result.timestamp).toBeInstanceOf(Date);  // Ensure the timestamp exists
        done();
    };

    request.onerror = function() {
        done.fail("Failed to retrieve data from the store");
    };
}, 10000);

// Test retrieving a non-existent record
test('should handle retrieving a non-existent record', async () => {
  const transaction = db.transaction(['FarmData'], 'readonly');
  const farmstore = transaction.objectStore('FarmData');
  
  const request = farmstore.get(999); // Non-existent ID
  
  const result = await new Promise((resolve, reject) => {
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.errorCode);
  });

  expect(result).toBeUndefined(); // Expecting undefined for non-existent data
});

test('should auto-increment key for each new entry', (done) => {
    const transaction = db.transaction(["FarmData"], "readwrite");
    const store = transaction.objectStore("FarmData");

    const newFarmData = {
        sensorReading: [25.2, 29], // Example sensor readings
        cropPhoto: 'data:image/png;base64,iVBOasiofq...', // Example base64 image
        farmerNote: "Just the same.",
        gpsCoordinate: [27.7749, 29.3230], // Example GPS coordinates
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
