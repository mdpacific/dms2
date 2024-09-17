describe('IndexedDB Tests', () => {
    let db;

    beforeAll((done) => {

        let request = indexedDB.open("AgricultureDB", 1);

        request.onupgradeneeded = function(event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("FarmData")) {
                db.createObjectStore("FarmData", { autoIncrement: true });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            done();
        };

        request.onerror = function(event) {
            console.error("Database error: ", event.target.errorCode);
            done.fail(event.target.errorCode);
        };
    });

    beforeEach((done) => {
        // Clear object store before each test to ensure isolation
        let transaction = db.transaction(["FarmData"], "readwrite");
        let objectStore = transaction.objectStore("FarmData");

        let clearRequest = objectStore.clear();

        clearRequest.onsuccess = function() {
            done();
        };

        clearRequest.onerror = function(event) {
            console.error("Clear object store error: ", event.target.errorCode);
            done.fail(event.target.errorCode);
        };
    });

    test('should store data in IndexedDB', (done) => {
        let transaction = db.transaction(["FarmData"], "readwrite");
        let objectStore = transaction.objectStore("FarmData");

        let data = {
            sensorReadings: [23.5, 45.2],
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
            farmerNote: "Checked the crop health, observed some pest issues.",
            gpsCoordinates: 37.7749,
            timestamp: new Date()
        };

        let request = objectStore.add(data);

        request.onsuccess = function(event) {
            expect(event.target.result).toBeGreaterThan(0); 
            done();
        };

        request.onerror = function(event) {
            console.error("Data store error: ", event.target.errorCode);
            done.fail(event.target.errorCode);
        };
    });

    test('should retrieve data from IndexedDB', (done) => {
        // First, store the data
        let transaction = db.transaction(["FarmData"], "readwrite");
        let objectStore = transaction.objectStore("FarmData");

        let data = {
            sensorReadings: [23.5, 45.2],
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAA...",
            farmerNote: "Checked the crop health, observed some pest issues.",
            gpsCoordinates: 37.7749,
            timestamp: new Date()
        };

        let addRequest = objectStore.add(data);

        addRequest.onsuccess = function(event) {
            let getRequest = objectStore.get(event.target.result); 

            getRequest.onsuccess = function(event) {
                let retrievedData = event.target.result;
                expect(retrievedData).toBeDefined();
                expect(retrievedData.sensorReadings).toEqual([23.5, 45.2]);
                expect(retrievedData.cropPhoto.startsWith("data:image/png;base64,")).toBe(true);
                expect(retrievedData.farmerNote).toBe("Checked the crop health, observed some pest issues.");
                expect(retrievedData.gpsCoordinates).toBe(37.7749);
                expect(retrievedData.timestamp).toBeInstanceOf(Date);
                done();
            };

            getRequest.onerror = function(event) {
                console.error("Data retrieval error: ", event.target.errorCode);
                done.fail(event.target.errorCode);
            };
        };

        addRequest.onerror = function(event) {
            console.error("Data store error: ", event.target.errorCode);
            done.fail(event.target.errorCode);
        };
    });

    test('should validate sensor readings format', () => {
        let sensorReadings = [23.5, 45.2];
        expect(Array.isArray(sensorReadings)).toBe(true);
        sensorReadings.forEach(reading => {
            expect(typeof reading).toBe('number');
        });
    });

    test('should validate crop photo format', () => {
        let cropPhoto = "data:image/png;base64,iVBORw0KGgoAAA...";
        expect(cropPhoto).toMatch(/^data:image\/png;base64,/);
    });

    test('should validate timestamp format', () => {
        let timestamp = new Date();
        expect(timestamp).toBeInstanceOf(Date);
    });
});
