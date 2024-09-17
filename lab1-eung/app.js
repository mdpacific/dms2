//Setup IndexedDB
let request = indexedDB.open("AgricultureDB", 1);
request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore("FarmData", { keyPath: "uuid", autoIncrement: true });
}

//Add an entry to farm data
request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(["FarmData"], "readwrite");
    let store = transaction.objectStore("FarmData");

    // Array: Sensor readings (temperature, humidity)
    let sensorReadings = [30, 45];

    // Image: Photo (Base64 encoded image string)
    let cropPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/krHCrkAAAAASUVORK5CYII=";

    // String: Note
    let farmerNote = "Not too hot";

    // Numbers: GPS
    let gpsCoordinates = 36.3123;

    // Data collection date
    let timestamp = new Date();

    let farmData = {
        "uuid": crypto.randomUUID(),
        "sensorReadings": sensorReadings,
        "cropPhoto": cropPhoto,
        "farmerNote": farmerNote,
        "gpsCoordinates": gpsCoordinates,
        "timestamp": timestamp
    }
    
    let addRequest = store.add(farmData);

    //Log data to browser console
    addRequest.onsuccess = function(event) {
        let id = event.target.result;
        let getRequest = store.get(id)
        getRequest.onsuccess = function(event) {
            let data = event.target.result;
            console.log("Data added successfully.");
            console.log("Retrived Data:")
            console.log("Sensor readings: ", data.sensorReadings);
            console.log("Crop photo: ", data.cropPhoto);
            console.log("Farmer Note: ", data.farmerNote);
            console.log("GPS Coordinates: ", data.gpsCoordinates);
            console.log("Timestamp: ", data.timestamp);


            console.assert(Array.isArray(data.sensorReadings), "Sensor readings must be array");
            console.assert(typeof data.cropPhoto == "string", "Crop photo must be string");
            console.assert(typeof data.farmerNote == "string", "Farmer note must be string");
            console.assert(typeof data.gpsCoordinates == "number", "GPS coordinates must be number");
            console.assert(timestamp instanceof Date, "Timestamp must be date");
        }

    };
};

