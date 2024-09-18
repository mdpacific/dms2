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
    const gpsCoordinates = document.getElementById("gpsCoordinates").value;
    const imageUpload = document.getElementById("imageUpload").files[0];

    // Input validation
    if (!sensorReading || !notes || !gpsCoordinates || !imageUpload) {
        alert("Please fill in all fields and upload an image.");
        return;
    }

    console.log("Adding data: ", { sensorReading, notes, gpsCoordinates });

    // Use FileReader to convert image to Base64
    const reader = new FileReader();
    reader.readAsDataURL(imageUpload); // Convert the image file to a Base64 string

    // Wait for the file to be fully loaded
    reader.onload = function (event) {
        const imageData = event.target.result;

        // Now that the file is fully read, open a transaction
        const transaction = db.transaction(["agriData"], "readwrite");
        const objectStore = transaction.objectStore("agriData");

        const newEntry = {
            sensorReading: parseFloat(sensorReading),
            notes: notes,
            gpsCoordinates: gpsCoordinates,  // Add GPS coordinates
            image: imageData,
            timestamp: new Date()
        };

        const addRequest = objectStore.add(newEntry);

        addRequest.onsuccess = () => {
            alert("Data added successfully!");
            // Clear input fields
            document.getElementById("sensorReading").value = "";
            document.getElementById("notes").value = "";
            document.getElementById("gpsCoordinates").value = "";
            document.getElementById("imageUpload").value = "";
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

    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const data = cursor.value;
            console.log("Displaying data:", data);  // Log the retrieved data

            // Create elements to display sensor reading, notes, GPS coordinates, image, and timestamp
            const dataDiv = document.createElement("div");

            const sensorReading = document.createElement("p");
            sensorReading.textContent = `Sensor Reading: ${data.sensorReading}`;

            const notes = document.createElement("p");
            notes.textContent = `Notes: ${data.notes}`;

            const gpsCoordinates = document.createElement("p");
            gpsCoordinates.textContent = `GPS Coordinates: ${data.gpsCoordinates}`; // Display GPS coordinates

            const timestamp = document.createElement("p");
            const date = new Date(data.timestamp);
            timestamp.textContent = `Timestamp: ${date.toLocaleString()}`;

            const image = document.createElement("img");
            image.src = data.image;
            image.alt = "Uploaded Image";

            dataDiv.appendChild(sensorReading);
            dataDiv.appendChild(notes);
            dataDiv.appendChild(gpsCoordinates);
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
