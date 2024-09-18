// Test 1: Check if IndexedDB is opening successfully
function testOpenIndexedDB() {
    const request = indexedDB.open('AgricultureDB', 1);
    request.onerror = (event) => {
        console.error('Test 1 Failed: Error opening the database:', event.target.errorCode);
    };
    request.onsuccess = (event) => {
        console.log('Test 1 Passed: IndexedDB opened successfully');
    };
    testAddData();
}

// Test 2: Check if data is added successfully to IndexedDB
function testAddData() {
    const transaction = db.transaction(['FarmingData'], 'readwrite');
    const objectStore = transaction.objectStore('FarmingData');

    let sensorReading = [27.8, 60.1]; // Temperature: 27.8°C, Humidity: 60.1%
    let image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...';
    let gpsCoordinates = 28.7041;  // Latitude for a location
    let farmerNotes = 'Checked soil moisture levels, noticed dry patches.';
    let timestamp = new Date().toISOString();
    
    const testData = {
        sensorReading,
        farmerNotes,
        image,
        gpsCoordinates,
        timestamp
    };

    const request = objectStore.add(testData);
    request.onsuccess = () => {
        console.log('Test 2 Passed: Data added successfully to IndexedDB');
    };
    request.onerror = () => {
        console.error('Test 2 Failed: Failed to add data');
    };
    testDataTypes();
}

// Test 3: Validate if data types are stored correctly (Array, Image, String, Number, Date)
function testDataTypes() {
    const transaction = db.transaction(['FarmingData'], 'readonly');
    const objectStore = transaction.objectStore('FarmingData');
    
    const request = objectStore.getAll();
    request.onsuccess = (event) => {
        const allData = event.target.result;
        if (allData.length > 0) {
            const item = allData[0];
            const isValid = Array.isArray(item.sensorReading) &&
                            typeof item.farmerNotes === 'string' &&
                            typeof item.image === 'string' &&
                            typeof item.gpsCoordinates === 'number' &&
                            !isNaN(new Date(item.timestamp).getTime());

            if (isValid) {
                console.log('Test 3 Passed: All data types are correctly stored');
            } else {
                console.error('Test 3 Failed: Data types validation failed');
            }
        }
    };
    testRetrieveData();
}

// Test 4: Validate if the retrieved data matches the inserted data
function testRetrieveData() {
    const transaction = db.transaction(['FarmingData'], 'readonly');
    const objectStore = transaction.objectStore('FarmingData');

    const request = objectStore.getAll();
    request.onsuccess = (event) => {
        const allData = event.target.result;
        if (allData.length > 0) {
            const testData = allData[allData.length - 1];
            if (testData.sensorReading[0] === 27.8 &&
                testData.farmerNotes === 'Checked soil moisture levels, noticed dry patches.' &&
                testData.image === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...') {
                console.log('Test 4 Passed: Retrieved data matches inserted data');
            } else {
                console.error('Test 4 Failed: Data mismatch');
            }
        }
    };
    testMissingFields();
}

// Test 5: Validate database handles absence of required fields (e.g., image missing)
function testMissingFields() {
    const transaction = db.transaction(['FarmingData'], 'readwrite');
    const objectStore = transaction.objectStore('FarmingData');

    const testData = {
        sensorReading: [25, 45], // Example sensor readings
        farmerNotes: 'Test note',
        gpsCoordinates: 37.7749,
        timestamp: new Date().toISOString()
    };

    try {
        objectStore.add(testData);
        transaction.oncomplete = () => {
            console.log('Test 5 Passed: Missing fields handled correctly');
        };
    } catch (error) {
        console.error('Test 5 Failed: Missing fields caused an error');
    }
    showData();
}
