// Open or create an IndexedDB
let db;
const request = indexedDB.open('agricultureDB', 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  // Create an object store for agricultural data
  const objectStore = db.createObjectStore('agriData', { keyPath: 'id', autoIncrement: true });
  objectStore.createIndex('sensor', 'sensor', { unique: false });
  objectStore.createIndex('note', 'note', { unique: false });
  objectStore.createIndex('image', 'image', { unique: false });
  objectStore.createIndex('gps', 'gps', { unique: false });
  objectStore.createIndex('timestamp', 'timestamp', { unique: false });
};

request.onsuccess = function(event) {
  db = event.target.result;
  displayStoredData();
};

request.onerror = function(event) {
  console.error('Database error:', event.target.errorCode);
};

// Form submission handler
document.getElementById('dataForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const sensor = document.getElementById('sensor').value;
  const note = document.getElementById('note').value;
  const imageInput = document.getElementById('image').files[0];
  const gps = 37.7749; // Sample GPS coordinate
  const timestamp = new Date().toISOString(); // Current date and time

  if (!sensor) {
    alert('Sensor reading is required.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    
    const newEntry = { sensor, note, image: imageData, gps, timestamp };

    const transaction = db.transaction(['agriData'], 'readwrite');
    const objectStore = transaction.objectStore('agriData');
    objectStore.add(newEntry);

    transaction.oncomplete = function() {
      displayStoredData();
      document.getElementById('dataForm').reset();
    };
    
    transaction.onerror = function(event) {
      console.error('Transaction error:', event.target.errorCode);
    };
  };

  if (imageInput) {
    reader.readAsDataURL(imageInput);
  } else {
    reader.onload();
  }
});

// Function to display stored data
function displayStoredData() {
  const transaction = db.transaction(['agriData'], 'readonly');
  const objectStore = transaction.objectStore('agriData');
  
  const request = objectStore.getAll();
  request.onsuccess = function(event) {
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';

    event.target.result.forEach(data => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>Sensor Reading:</strong> ${data.sensor}<br>
        <strong>Note:</strong> ${data.note}<br>
        ${data.image ? `<strong>Image:</strong><br><img src="${data.image}" width="100"><br>` : ''}
        <strong>GPS Coordinates:</strong> ${data.gps}<br>
        <strong>Timestamp:</strong> ${new Date(data.timestamp).toLocaleString()}<br>
      `;
      dataList.appendChild(listItem);
    });
  };
}

// Function to retrieve and log stored data
function logStoredData() {
  const transaction = db.transaction(['agriData'], 'readonly');
  const objectStore = transaction.objectStore('agriData');
  
  const request = objectStore.getAll();
  request.onsuccess = function(event) {
    const data = event.target.result;

    console.log('Retrieved Data:');
    
    data.forEach(entry => {
      console.log('Sensor Reading:', JSON.parse(entry.sensor)); // Parse array from JSON
      console.log('Note:', entry.note);
      console.log('Image:', entry.image); // Base64 encoded string
      console.log('GPS Coordinates:', entry.gps);
      console.log('Timestamp:', new Date(entry.timestamp).toLocaleString()); // Convert to readable date
    });
  };

  request.onerror = function(event) {
    console.error('Error retrieving data:', event.target.errorCode);
  };
}

// Call logStoredData after the database is successfully opened
request.onsuccess = function(event) {
  db = event.target.result;
  logStoredData(); // Retrieve and log data
};
