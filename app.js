// Open or create the IndexedDB database
let db;

const request = indexedDB.open("agricultureDB", 1);

// This event triggers if the database is newly created or upgraded
request.onupgradeneeded = (event) => {
    console.log("Upgrading or creating the database...");
    db = event.target.result;
    db.createObjectStore("agriData", { keyPath: "id", autoIncrement: true });
};

// If the database is successfully opened
request.onsuccess = (event) => {
    db = event.target.result;
    console.log("Database opened successfully.");
};

// If there's an error opening the database
request.onerror = (event) => {
    console.error("Database error:", event.target.errorCode);
};

// Function to add data to IndexedDB
function addData() {
    const sensorReading = document.getElementById("sensorReading").value;
    const notes = document.getElementById("notes").value;
    const imageUpload = document.getElementById("imageUpload").files[0];
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    // Input validation
    if (!sensorReading || !notes || !imageUpload || !latitude || !longitude) {
        alert("Please fill in all fields and upload an image.");
        return;
    }

    // Use FileReader to convert image to Base64
    const reader = new FileReader();
    reader.readAsDataURL(imageUpload); // Convert the image file to a Base64 string

    reader.onload = function (event) {
        const imageData = event.target.result;

        // Convert latitude and longitude to float before storing
        const latFloat = parseFloat(latitude);
        const longFloat = parseFloat(longitude);

        if (isNaN(latFloat) || isNaN(longFloat)) {
            alert("Please enter valid GPS coordinates.");
            return;
        }

        // Open a transaction to store data
        const transaction = db.transaction(["agriData"], "readwrite");
        const objectStore = transaction.objectStore("agriData");

        const newEntry = {
            sensorReading: parseFloat(sensorReading),
            notes: notes,
            image: imageData,
            latitude: latFloat,  // Store latitude as float
            longitude: longFloat, // Store longitude as float
            timestamp: new Date()
        };

        const addRequest = objectStore.add(newEntry);

        addRequest.onsuccess = () => {
            alert("Data added successfully!");
            // Clear input fields
            document.getElementById("sensorReading").value = "";
            document.getElementById("notes").value = "";
            document.getElementById("imageUpload").value = "";
            document.getElementById("latitude").value = "";
            document.getElementById("longitude").value = "";
        };

        addRequest.onerror = () => {
            alert("Error adding data.");
        };
    };

    reader.onerror = () => {
        alert("Error reading the image file.");
    };
}

// Function to display stored data
function displayData() {
    const transaction = db.transaction(["agriData"], "readonly");
    const objectStore = transaction.objectStore("agriData");

    const displayDiv = document.getElementById("display");
    displayDiv.innerHTML = ""; // Clear previous display

    const request = objectStore.openCursor();
    let serialNumber = 1; // Assign serial numbers to displayed data

    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const data = cursor.value;

            // Log the data to check if it's being retrieved correctly
            console.log('Retrieved data:', data);

            // Create elements to display sensor reading, notes, image, GPS coordinates, and timestamp
            const dataDiv = document.createElement("div");

            const serial = document.createElement("p");
            serial.textContent = `Serial Number: ${serialNumber++}`; // Increment serial number

            const sensorReading = document.createElement("p");
            sensorReading.textContent = `Sensor Reading: ${data.sensorReading}`;

            const notes = document.createElement("p");
            notes.textContent = `Notes: ${data.notes}`;

            // Check if GPS coordinates are available and display them
            const gps = document.createElement("p");
            if (data.latitude !== undefined && data.longitude !== undefined) {
                gps.textContent = `GPS Coordinates: Latitude - ${data.latitude}, Longitude - ${data.longitude}`;
            } else {
                gps.textContent = `GPS Coordinates: Not available`;
            }

            const timestamp = document.createElement("p");
            const date = new Date(data.timestamp);
            timestamp.textContent = `Timestamp: ${date.toLocaleString()}`;

            const image = document.createElement("img");
            image.src = data.image;
            image.alt = "Uploaded Image";

            dataDiv.appendChild(serial);
            dataDiv.appendChild(sensorReading);
            dataDiv.appendChild(notes);
            dataDiv.appendChild(gps);
            dataDiv.appendChild(timestamp);
            dataDiv.appendChild(image);
            displayDiv.appendChild(dataDiv);

            cursor.continue();
        } else {
            if (displayDiv.innerHTML === "") {
                displayDiv.innerHTML = "<p>No data stored.</p>";
            }
            console.log("All data displayed.");
        }
    };

    request.onerror = () => {
        console.error("Error retrieving data.");
    };
}

// Attach event listeners to buttons after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addDataButton").addEventListener("click", addData);
    document.getElementById("displayDataButton").addEventListener("click", displayData);
});
