// Import necessary modules if required (in case you separate logic from tests)

// Mock Data
let sensorReadings = [23.5, 45.2]; // Temperature: 23.5°C, Humidity: 45.2%
let cropPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...";
let farmerNote = "Checked the crop health, observed some pest issues.";
let gpsCoordinates = 37.7749;
let timestamp = new Date(); // Current date and time

// Unit Test Cases
describe('Sensor Data Tests', () => {
  
  test('Sensor readings should contain valid temperature and humidity values', () => {
    // Check if sensorReadings has exactly two values (temperature and humidity)
    expect(sensorReadings.length).toBe(2);
    
    // Check if temperature and humidity are numbers
    expect(typeof sensorReadings[0]).toBe('number');
    expect(typeof sensorReadings[1]).toBe('number');
    
    // Check if temperature is within a reasonable range
    expect(sensorReadings[0]).toBeGreaterThan(-50); // lower bound for temperature
    expect(sensorReadings[0]).toBeLessThan(60); // upper bound for temperature
    
    // Check if humidity is within the 0-100% range
    expect(sensorReadings[1]).toBeGreaterThanOrEqual(0);
    expect(sensorReadings[1]).toBeLessThanOrEqual(100);
  });

  test('Crop photo should be a valid Base64 image string', () => {
    // Check if cropPhoto is a string
    expect(typeof cropPhoto).toBe('string');
    
    // Check if cropPhoto starts with the proper Base64 header for an image
    expect(cropPhoto.startsWith("data:image/")).toBe(true);
    
    // Check if cropPhoto contains valid Base64 encoding characters after header
    expect(cropPhoto).toMatch(/^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/]+={0,2}$/);
  });

  test('Farmer note should be a non-empty string', () => {
    // Check if farmerNote is a string
    expect(typeof farmerNote).toBe('string');
    
    // Check if farmerNote is not empty
    expect(farmerNote.length).toBeGreaterThan(0);
    
    // Optionally, check if farmerNote contains specific keywords related to farming
    expect(farmerNote).toMatch(/crop|health|pest/);
  });

  test('GPS coordinates should be a valid latitude value', () => {
    // Check if gpsCoordinates is a number
    expect(typeof gpsCoordinates).toBe('number');
    
    // Check if latitude value is within valid range (-90 to 90)
    expect(gpsCoordinates).toBeGreaterThanOrEqual(-90);
    expect(gpsCoordinates).toBeLessThanOrEqual(90);
  });

  test('Timestamp should be a valid Date object and not a future date', () => {
    // Check if timestamp is a Date object
    expect(timestamp instanceof Date).toBe(true);
    
    // Check if timestamp is not NaN (invalid Date)
    expect(isNaN(timestamp)).toBe(false);
    
    // Check if timestamp is not in the future
    const now = new Date();
    expect(timestamp.getTime()).toBeLessThanOrEqual(now.getTime());
  });
});
