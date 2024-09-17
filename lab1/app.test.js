const { sensorReadings, cropPhoto, farmerNote, gpsCoordinates, timestamp } = require('./app');

test('Sensor readings should be an array', () => {
    expect(Array.isArray(sensorReadings)).toBe(true);
});

test('Crop photo should be a string', () => {
    expect(typeof cropPhoto).toBe('string');
});

test('Farmer note should be a string', () => {
    expect(typeof farmerNote).toBe('string');
});

test('GPS coordinates should be a number', () => {
    expect(typeof gpsCoordinates).toBe('number');
});

test('Timestamp should be a date object', () => {
    expect(timestamp instanceof Date).toBe(true);
});

afterEach(async () => {
    // Wait for all asynchronous operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
});
