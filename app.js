let db;

// Open (or create) IndexedDB
const request = indexedDB.open('AgricultureDB', 1);

// Setup the database
request.onupgradeneeded = (event) => {
    db = event.target.result;
    const store = db.createObjectStore('FarmData', { keyPath: 'id', autoIncrement: true });
    store.createIndex('sensorReadings', 'sensorReadings', { unique: false });
    store.createIndex('cropPhoto', 'cropPhoto', { unique: false });
    store.createIndex('farmerNote', 'farmerNote', { unique: false });
    store.createIndex('gpsCoordinates', 'gpsCoordinates', { unique: false });
    store.createIndex('timestamp', 'timestamp', { unique: false });
};

request.onsuccess = (event) => {
    db = event.target.result;
};

// Function to add data to IndexedDB
function addFarmData(sensorReadings, cropPhoto, farmerNote, gpsCoordinates) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['FarmData'], 'readwrite');
        const store = transaction.objectStore('FarmData');
        const timestamp = new Date();

        const data = {
            sensorReadings: sensorReadings.split(',').map(Number),
            cropPhoto,
            farmerNote,
            gpsCoordinates: parseFloat(gpsCoordinates),
            timestamp: timestamp.toISOString()
        };

        const request = store.add(data);

        request.onsuccess = () => {
            console.log('Data added successfully');
            resolve();
        };

        request.onerror = (event) => {
            console.error('Error adding data:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Function to display all data from FarmData
function displayData() {
    const transaction = db.transaction(['FarmData'], 'readonly');
    const store = transaction.objectStore('FarmData');
    const request = store.getAll();

    request.onsuccess = (event) => {
        const data = event.target.result;
        const storedDataDiv = document.getElementById('storedData');
        storedDataDiv.innerHTML = '';  // Clear previous content

        if (data.length === 0) {
            storedDataDiv.innerHTML = "<p>No data found in the FarmData store.</p>";
        } else {
            data.forEach((item, index) => {
                const entry = document.createElement('div');
                entry.innerHTML = `
                    <h3>Entry ${index + 1}</h3>
                    <p><strong>Sensor Readings:</strong> ${item.sensorReadings.join(', ')}</p>
                    <p><strong>Crop Photo:</strong> <img src="${item.cropPhoto}" alt="Crop Photo" width="150"></p>
                    <p><strong>Farmer Note:</strong> ${item.farmerNote}</p>
                    <p><strong>GPS Coordinates:</strong> ${item.gpsCoordinates}</p>
                    <p><strong>Timestamp:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
                    <hr>
                `;
                storedDataDiv.appendChild(entry);
            });
        }
    };

    request.onerror = (event) => {
        console.error("Error retrieving data: ", event.target.error);
    };
}

// Event listeners
document.getElementById('agriForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const sensorReadings = document.getElementById('sensorReading').value;
    const cropPhoto = document.getElementById('cropPhoto').files[0];
    const farmerNote = document.getElementById('farmerNote').value;
    const gpsCoordinates = document.getElementById('gpsCoordinates').value;

    const reader = new FileReader();
    reader.onloadend = () => {
        const cropPhotoBase64 = reader.result;  // Base64 encoding of the image
        addFarmData(sensorReadings, cropPhotoBase64, farmerNote, gpsCoordinates)
            .then(() => {
                document.getElementById('agriForm').reset();  // Clear form after submission
            })
            .catch((error) => console.error(error));
    };

    if (cropPhoto) {
        reader.readAsDataURL(cropPhoto);
    }
});

document.getElementById('displayDataButton').addEventListener('click', displayData);
