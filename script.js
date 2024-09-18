
let db;
const request = indexedDB.open('AgricultureDB', 1);

request.onerror = (event) => {
    console.log('Error opening the database:', event.target.errorCode);
};

request.onsuccess = (event) => {
    db = event.target.result;
    console.log('db >',db)
    console.log('Database opened successfully');
};

request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore('FarmingData', { keyPath: 'id', autoIncrement: true });
};

// Function to show agriculture data on the browser.
function showData() {
    showDataInConsole();
    const transaction = db.transaction(['FarmingData'], 'readonly');
    const objectStore = transaction.objectStore('FarmingData');

    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const allData = event.target.result;
        if (allData.length > 0) {
            const output = document.getElementById('table_body');
            output.innerHTML = '';
            allData.map((item, index) => {
                output.innerHTML += `
                <tr>
                    <td align='center'> ${index + 1} </td>
                    <td> Temperature: ${item.sensorReading[0]}°C, Humidity: ${item.sensorReading[1]}% </td>
                    <td align='center' width='150px'> <img src='${item.image}' height="120px" width="120px" style="object-fit: contain"> </td>
                    <td> ${item.gpsCoordinates} </td>
                    <td> ${item.farmerNotes} </td>
                    <td> ${new Date(item.timestamp).toLocaleString()} </td>
                </tr>`;
            });
        } else {
            document.getElementById('data_table').style.display = 'none';
            const output = document.getElementById('output');
            output.innerHTML = '<h3 align="center"> No Records Found. </h3>';
        }
    };
}

// Function to show agriculture data form
function showForm() {
    document.getElementById('data_form').style.display = 'block';
    document.getElementById('agriculture_data').style.display = 'none';
}

// Function to return to the agriculture listing page.
function back() {
    document.getElementById('data_form').style.display = 'none';
    document.getElementById('agriculture_data').style.display = 'block';
    showData();
}

// Add form data into the database.
function handleSubmit(event) {
    event.preventDefault();

    const temperature = parseFloat(document.getElementById('temperature').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const gpsCoordinates = parseFloat(document.getElementById('gpsCoordinates').value);
    const farmerNotes = document.getElementById('farmerNotes').value;
    const imageFile = document.getElementById('imageUpload').files[0];

    const data = {
        sensorReading: [temperature, humidity], // Array of sensor readings
        gpsCoordinates: gpsCoordinates, // GPS coordinates
        farmerNotes: farmerNotes,
        timestamp: new Date().toISOString(), // Timestamp of data collection
    };

    const reader = new FileReader();
    reader.onload = function (e) {
        data.image = e.target.result; // Image file encoded as Base64

        const transaction = db.transaction(['FarmingData'], 'readwrite');
        const objectStore = transaction.objectStore('FarmingData');
        objectStore.add(data);

        transaction.oncomplete = () => {
            alert('Data stored successfully.');
            document.getElementById('agriculture_form').reset();
            back();
        };

        transaction.onerror = () => {
            alert('Failed to store data');
        };
    };
    reader.readAsDataURL(imageFile);
}

// Show data in the browser console.
function showDataInConsole() {
    const transaction = db.transaction(['FarmingData'], 'readonly');
    const objectStore = transaction.objectStore('FarmingData');

    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const allData = event.target.result;
        if (allData.length > 0) {
            console.log("Data retrieved from IndexedDB:");
            allData.forEach((item, index) => {
                console.log(`Record ${index + 1}:`);
                console.log("Sensor Readings (Temperature, Humidity):", item.sensorReading);
                console.log("Image (Base64 Encoded):", item.image);
                console.log("farmerNotes:", item.farmerNotes);
                console.log("GPS Coordinates:", item.gpsCoordinates);
                console.log("Timestamp:", new Date(item.timestamp).toLocaleString());
                console.log("-------------------------------");
            });
        } else {
            console.log('No Data Found.');
        }
    };
}

