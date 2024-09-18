const { addFarmData } = require('./app.js'); // Ensure addFarmData is exported from app.js

describe('Agricultural Data Collection Tests with real IndexedDB', () => {
    let db;

    beforeEach((done) => {
        // Open the real IndexedDB in the JSDOM environment
        const request = indexedDB.open('AgricultureDB', 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            const store = db.createObjectStore('FarmData', { keyPath: 'id', autoIncrement: true });
            store.createIndex('sensorReadings', 'sensorReadings', { unique: false });
            store.createIndex('cropPhoto', 'cropPhoto', { unique: false });
            store.createIndex('farmerNote', 'farmerNote', { unique: false });
            store.createIndex('gpsCoordinates', 'gpsCoordinates', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
        };

        request.onsuccess = () => {
            db = request.result;
            done();
        };
    });

    test('should store valid data in real IndexedDB', async () => {
        const sensorReadings = "25, 30, 35";
        const cropPhotoFile = "data:image/png;base64,iVBORw0KGgo...";  // Simulated base64 image
        const farmerNote = "The crops are healthy.";
        const gpsCoordinates = "123.456";

        await addFarmData(sensorReadings, cropPhotoFile, farmerNote, gpsCoordinates);

        const transaction = db.transaction(['FarmData'], 'readonly');
        const store = transaction.objectStore('FarmData');
        const request = store.get(1);  // Get the first entry

        request.onsuccess = (event) => {
            const data = event.target.result;
            expect(data.sensorReadings).toEqual([25, 30, 35]);
            expect(data.cropPhoto).toBe(cropPhotoFile);
            expect(data.farmerNote).toBe(farmerNote);
            expect(data.gpsCoordinates).toBe(123.456);
        };
    });

    test('should handle empty or null data gracefully', async () => {
        const sensorReadings = "";
        const cropPhotoFile = null;
        const farmerNote = "";
        const gpsCoordinates = null;

        try {
            await addFarmData(sensorReadings, cropPhotoFile, farmerNote, gpsCoordinates);
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});
