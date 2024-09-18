require('fake-indexeddb/auto');
const { sensorReading, cropPhoto, farmerNote, gpsCoordinate, timestamp } = require('./app.js');

let db;
jest.mock('./app.js', () => {
  return {
      sensorReading: [23.5, 45.2],
      cropPhoto: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."],
      farmerNote: "Checked the crop health, observed some pest issues.",
      gpsCoordinate: [40.7128, -74.0060],
      timestamp: new Date()
  };
});

// Setup before each test
beforeEach(() => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AgricultureDB", 2);
    
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
      if(db.objectStoreNames.contains('FarmData')) {
        db.deleteObjectStore('FarmData');
        db.createObjectStore('FarmData', {keypath: 'id', autoIncrement: true });
      }
      else {
        db.createObjectStore('FarmData', {keypath: 'id', autoIncrement: true });
      };
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
    timestamp,
  };
  
  const request = farmstore.add(data);
  console.log("data", data);
  
  
  await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.errorCode);
  });

  expect(request.result).toBeDefined();
});

// Test retrieving data from the database
test('should retrieve data from the FarmData object store', async () => {
  const transaction = db.transaction(['FarmData'], 'readwrite');
  const farmstore = transaction.objectStore('FarmData');
  
  farmstore.add({sensorReading, cropPhoto, farmerNote, gpsCoordinate, timestamp });
  console.log("keypath", farmstore.keyPath);
  
  const request = farmstore.get(1);
  
  request.onsuccess = (event) => {
    const someData = event.target.result;
    expect(someData.sensorReading).toEqual([23.5, 45.2]);
  expect(someData.cropPhoto[0]).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...");
  expect(someData.farmerNote).toBe("Checked the crop health, observed some pest issues.");
  expect(someData.gpsCoordinate[0]).toBe(40.7128);
  expect(timestamp instanceof Date).toBe(true); 
    
  };
  
});

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
