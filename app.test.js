/**
 * @jest-environment jsdom
 */

describe("IndexedDB Agricultural Data Tests", () => {
    let db;

    // Helper function to open the database
    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("AgricultureDB", 1);

            request.onupgradeneeded = (event) => {
                db = event.target.result;
                if (!db.objectStoreNames.contains("FarmData")) {
                    db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
                }
            };

            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };

            request.onerror = (event) => {
                reject(event);
            };
        });
    };

    // Clear the database before each test
    beforeEach(async () => {
        db = await openDB();
        const transaction = db.transaction(["FarmData"], "readwrite");
        const objectStore = transaction.objectStore("FarmData");
        objectStore.clear(); // Clear the object store before each test
    });

    // Close the database after each test
    afterEach(() => {
        if (db) {
            db.close();
        }
    });

    // Unit Test 1: Add Data Successfully
    test("Should add data to IndexedDB successfully", async () => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const objectStore = transaction.objectStore("FarmData");

        const data = {
            sensorReadings: [23.5, 45.2], // Example: temperature, humidity
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
            farmerNote: "Checked the crop health.",
            gpsCoordinates: 37.7749,
            timestamp: new Date(),
        };

        const request = objectStore.add(data);

        const result = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        expect(result).toBeDefined();  // Ensure the data has been added
    });

    // Unit Test 2: Retrieve Data and Validate Values
    test("Should retrieve data from IndexedDB and validate values", async () => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const objectStore = transaction.objectStore("FarmData");

        const data = {
            sensorReadings: [23.5, 45.2],
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
            farmerNote: "Checked the crop health.",
            gpsCoordinates: 37.7749,
            timestamp: new Date(),
        };

        const addRequest = objectStore.add(data);

        const result = await new Promise((resolve, reject) => {
            addRequest.onsuccess = () => {
                const getRequest = objectStore.get(addRequest.result);
                getRequest.onsuccess = () => resolve(getRequest.result);
                getRequest.onerror = () => reject(getRequest.error);
            };
        });

        expect(result).toBeDefined();
        expect(result.sensorReadings).toEqual([23.5, 45.2]);
        expect(result.cropPhoto).toContain("data:image/png");
        expect(result.farmerNote).toBe("Checked the crop health.");
        expect(result.gpsCoordinates).toBe(37.7749);
        expect(result.timestamp).toBeInstanceOf(Date);
    });

    // Unit Test 3: Delete Data and Confirm Non-Existence
    test("Should delete data from IndexedDB and confirm it no longer exists", async () => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const objectStore = transaction.objectStore("FarmData");

        const data = {
            sensorReadings: [23.5, 45.2],
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
            farmerNote: "Checked the crop health.",
            gpsCoordinates: 37.7749,
            timestamp: new Date(),
        };

        const addRequest = objectStore.add(data);

        const deleteResult = await new Promise((resolve, reject) => {
            addRequest.onsuccess = () => {
                const deleteRequest = objectStore.delete(addRequest.result);
                deleteRequest.onsuccess = () => resolve(deleteRequest.result);
                deleteRequest.onerror = () => reject(deleteRequest.error);
            };
        });

        const getResult = await new Promise((resolve, reject) => {
            const getRequest = objectStore.get(addRequest.result);
            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        });

        expect(getResult).toBeUndefined();  // Ensure the data is deleted
    });

    // Unit Test 4: Validate Data Types in IndexedDB
    test("Should validate data types in IndexedDB", async () => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const objectStore = transaction.objectStore("FarmData");

        const data = {
            sensorReadings: [23.5, 45.2],
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
            farmerNote: "Checked the crop health.",
            gpsCoordinates: 37.7749,
            timestamp: new Date(),
        };

        const addRequest = objectStore.add(data);

        const result = await new Promise((resolve, reject) => {
            addRequest.onsuccess = () => {
                const getRequest = objectStore.get(addRequest.result);
                getRequest.onsuccess = () => resolve(getRequest.result);
                getRequest.onerror = () => reject(getRequest.error);
            };
        });

        expect(Array.isArray(result.sensorReadings)).toBe(true);  // sensorReadings should be an array
        expect(typeof result.cropPhoto).toBe("string");           // cropPhoto should be a string
        expect(typeof result.farmerNote).toBe("string");          // farmerNote should be a string
        expect(typeof result.gpsCoordinates).toBe("number");      // gpsCoordinates should be a number
        expect(result.timestamp instanceof Date).toBe(true);      // timestamp should be a date object
    });

    // Unit Test 5: Prevent Adding Data Without Required Fields
    test("Should prevent adding data without sensorReadings", async () => {
        const transaction = db.transaction(["FarmData"], "readwrite");
        const objectStore = transaction.objectStore("FarmData");

        // Data without sensorReadings
        const invalidData = {
            cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
            farmerNote: "Checked the crop health.",
            gpsCoordinates: 37.7749,
            timestamp: new Date(),
        };

        const addRequest = objectStore.add(invalidData);

        await new Promise((resolve, reject) => {
            addRequest.onsuccess = () => reject(new Error("Data was added without sensorReadings!"));
            addRequest.onerror = () => resolve();  // Ensure the error occurs as expected
        });
    });
});
