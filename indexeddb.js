const dbName = "AgricultureDB";

function openDatabase(callback) {
  const request = indexedDB.open(dbName, 1);
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("FarmData", { keyPath: "id", autoIncrement: true });
    console.log("Database upgraded or created.");
  };
  request.onsuccess = function(event) {
    console.log("Database opened successfully.");
    callback(null, event.target.result);
  };
  request.onerror = function(event) {
    console.error("Error opening database:", event.target.error);
    callback(event.target.error);
  };
}

function createData(db, data, callback) {
  const transaction = db.transaction(["FarmData"], "readwrite");
  const store = transaction.objectStore("FarmData");
  const request = store.add(data);
  request.onsuccess = function(event) {
    console.log("Data added successfully.");
    callback(null, event.target.result);
  };
  request.onerror = function(event) {
    console.error("Error adding data:", event.target.error);
    callback(event.target.error);
  };
}

function readAllData(db, callback) {
  const transaction = db.transaction(["FarmData"], "readonly");
  const store = transaction.objectStore("FarmData");
  const request = store.getAll();
  request.onsuccess = function(event) {
    console.log("Data retrieved successfully.");
    callback(null, event.target.result);
  };
  request.onerror = function(event) {
    console.error("Error retrieving data:", event.target.error);
    callback(event.target.error);
  };
}

function displayData(db) {
  readAllData(db, function(error, data) {
    if (error) {
      console.error("Failed to retrieve data:", error);
    } else {
      const dataDisplay = document.getElementById("dataDisplay");
      dataDisplay.innerHTML = "";
      data.forEach((entry) => {
        const div = document.createElement("div");
        div.classList.add("data-entry");
        div.innerHTML = `
          <p><strong>Temperature:</strong> ${entry.sensorReadings[0]}°C</p>
          <p><strong>Humidity:</strong> ${entry.sensorReadings[1]}%</p>
          <p><strong>Farmer Note:</strong> ${entry.farmerNote}</p>
          <p><strong>GPS:</strong> ${entry.gpsCoordinates ? entry.gpsCoordinates.join(', ') : 'Not available'}</p>
          <p><strong>Timestamp:</strong> ${new Date(entry.timestamp).toLocaleString()}</p>
          ${entry.cropPhoto ? `<img src="${entry.cropPhoto}" alt="Crop Photo" class="crop-photo">` : ''}
        `;
        dataDisplay.appendChild(div);
      });
    }
  });
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => resolve([position.coords.latitude, position.coords.longitude]),
        error => reject(error)
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

function main() {
  openDatabase(function(error, db) {
    if (error) {
      console.error("Failed to open database:", error);
      return;
    }

    document.getElementById("dataForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const temperature = document.getElementById("temperature").value;
      const humidity = document.getElementById("humidity").value;
      const cropPhotoFile = document.getElementById("cropPhoto").files[0];
      const farmerNotes = document.getElementById("farmerNotes").value;

      getCurrentPosition().then(coordinates => {
        const data = {
          sensorReadings: [parseFloat(temperature), parseFloat(humidity)],
          farmerNote: farmerNotes,
          gpsCoordinates: coordinates,
          timestamp: new Date().toISOString()
        };

        if (cropPhotoFile) {
          const reader = new FileReader();
          reader.onload = function(e) {
            data.cropPhoto = e.target.result;
            createData(db, data, function(error, id) {
              if (!error) displayData(db);
            });
          };
          reader.readAsDataURL(cropPhotoFile);
        } else {
          createData(db, data, function(error, id) {
            if (!error) displayData(db);
          });
        }
      }).catch(error => {
        console.error("Error getting GPS coordinates:", error);
        const data = {
          sensorReadings: [parseFloat(temperature), parseFloat(humidity)],
          farmerNote: farmerNotes,
          gpsCoordinates: null,
          timestamp: new Date().toISOString()
        };
        createData(db, data, function(error, id) {
          if (!error) displayData(db);
        });
      });

      e.target.reset();
    });

    displayData(db);
  });
}

document.addEventListener("DOMContentLoaded", main);