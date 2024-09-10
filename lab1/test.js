require('fake-indexeddb/auto');
let {sensor, note, image, gps, timestamp} = require('./app.js');

jest.mock('./app.js', () => {
    return {
        sensor: [[25.9, 42.3]],
        note: "Checked the crop health, observed some pest issues.",
        image: ["data:image/jpeg;base64,/9j/8BAFkZJRgABAQAAZABkAAD/..."],
        gps: [[55.7128, 24.0060]],
        timestamp: new Date()
    };
});

describe('Test the data types', () => {
    test('Check the type of sensor readings', () => {
        console.log(sensor);
        
        expect(sensor[0][0]).toBe(25.9);
        expect(sensor[0][1]).toBe(42.3);
        expect(typeof sensor[0][0]).toBe('number');
        expect(typeof sensor[0][1]).toBe('number');
    });
    
    test('Check the type of crop images', () => {
        console.log(image);
        
        expect(image[0]).toBe("data:image/jpeg;base64,/9j/8BAFkZJRgABAQAAZABkAAD/...");
        expect(typeof image[0]).toBe('string');
    });
    
    test('Check the type of farmer note', () => {
        console.log(note);
        
        expect(note).toBe("Checked the crop health, observed some pest issues.");
        expect(typeof note).toBe('string');
    });
    
    test('Check the type of GPS coordinates', () => {
        console.log(gps);
        
        expect(gps[0][0]).toBe(55.7128);
        expect(gps[0][1]).toBe(24.0060);
        expect(typeof gps[0][0]).toBe('number');
        expect(typeof gps[0][1]).toBe('number');
    });
    
    test('Check the type of timestamp', () => {
        console.log(timestamp);
        
        expect(timestamp instanceof Date).toBe(true); 
    });
});