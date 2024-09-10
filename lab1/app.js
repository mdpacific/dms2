// temperature and humidity readings in celsius and % respectively
let sensor = [[25.9, 42.3]]; // example readings temperature 23.5, humidity 45.2

//Crop images: (Base64, encoded image string)
let image = ["data:image/jpeg;base64,/9j/8BAFkZJRgABAQAAZABkAAD/..."] //example image

//String: Farmer notes and descriptions
let note = "Checked the crop health, observed some pest issues.";

//Number: GPS coordinates(latitude, longitude)
let gps = [[55.7128, 24.0060]];
//Date: Timestamp of the data collection
let timestamp = new Date(); //current date and time

let openRequest = indexedDB.open("AgricultureDB", 2);

openRequest.onupgradeneeded = (event)  => {
  let db = event.target.result;

  let farmStore = db.createObjectStore("FarmData", {keypath: "id", autoIncrement: true});

}

openRequest.onerror = function() {
    console.error("Error", openRequest.error);
  }
  
    openRequest.onsuccess = (event) => {
    let db = event.target.result;
    console.log("Success", db);

    let transaction = db.transaction(["FarmData"], "readwrite");

    let farmStore = transaction.objectStore("FarmData");

    farmStore.add({sensor, image, note, gps, timestamp}); //add data to the store

    let getRequest = farmStore.get(1);

     getRequest.onsuccess = (event) => {
        let farmDataRequest = event.target.result;
        console.log('Sensor :- ', farmDataRequest.sensor.map(reading => reading.join('\u2103, ') + '%') + [' type:- '] + typeof farmDataRequest.sensor[0][0]);
        console.log('image:- ', farmDataRequest.image + [' type:- '] + typeof farmDataRequest.image[0]);
        console.log('note:- ', farmDataRequest.note + [' type:- '] + typeof farmDataRequest.note);
        console.log('GPS :- ', farmDataRequest.gps.map(coord => 'Latitude ' + coord.join(', Longitude ')) + [' type:- '] + typeof farmDataRequest.gps[0][0]);
        console.log('Current Date and Time:- ', farmDataRequest.timestamp + [' type:- '] + (farmDataRequest.timestamp instanceof Date == true ? 'Date' : 'Not a Date'));
    }

    transaction.oncomplete = (event) => {
        db.close();
    };
  }

  module.exports = {sensor, image, note, gps, timestamp};