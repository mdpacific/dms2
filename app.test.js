// app.test.js

const { addData, displayData } = require('./app.js'); // Assuming your functions are in app.js

// Mock IndexedDB for unit tests
const mockIndexedDB = {
    open: jest.fn(),
    transaction: jest.fn(() => ({
        objectStore: jest.fn(() => ({
            add: jest.fn(),
            openCursor: jest.fn()
        }))
    }))
};

global.indexedDB = mockIndexedDB;

// Mock DOM elements
document.getElementById = jest.fn((id) => {
    const elements = {
        sensorReading: { value: "100" },
        notes: { value: "Test note" },
        imageUpload: { files: [new Blob()] },
        latitude: { value: "40.7128" },
        longitude: { value: "-74.0060" },
        display: { innerHTML: "" }
    };
    return elements[id];
});

// Test 1: Check if valid data is being added
test("should add valid data", () => {
    const mockAdd = jest.fn();
    mockIndexedDB.transaction().objectStore().add.mockImplementation(mockAdd);

    addData(); // Trigger the addData function

    expect(mockAdd).toHaveBeenCalled(); // Ensure that data was added
    const addedData = mockAdd.mock.calls[0][0]; // Get the first call to add() with its data
    expect(addedData.sensorReading).toBe(100); // Verify sensorReading
    expect(addedData.notes).toBe("Test note"); // Verify notes
    expect(addedData.latitude).toBe(40.7128); // Verify latitude
    expect(addedData.longitude).toBe(-74.006); // Verify longitude
});

// Test 2: Check if data is not added when fields are empty
test("should not add data with missing fields", () => {
    document.getElementById = jest.fn((id) => {
        const elements = {
            sensorReading: { value: "" }, // Empty field
            notes: { value: "Test note" },
            imageUpload: { files: [new Blob()] },
            latitude: { value: "40.7128" },
            longitude: { value: "-74.0060" },
            display: { innerHTML: "" }
        };
        return elements[id];
    });

    const mockAdd = jest.fn();
    mockIndexedDB.transaction().objectStore().add.mockImplementation(mockAdd);

    addData(); // Trigger the addData function

    expect(mockAdd).not.toHaveBeenCalled(); // Ensure that data was not added due to empty field
});

// Test 3: Check if GPS coordinates are valid numbers
test("should not add data with invalid GPS coordinates", () => {
    document.getElementById = jest.fn((id) => {
        const elements = {
            sensorReading: { value: "100" },
            notes: { value: "Test note" },
            imageUpload: { files: [new Blob()] },
            latitude: { value: "invalid" }, // Invalid latitude
            longitude: { value: "-74.0060" },
            display: { innerHTML: "" }
        };
        return elements[id];
    });

    const mockAdd = jest.fn();
    mockIndexedDB.transaction().objectStore().add.mockImplementation(mockAdd);

    addData(); // Trigger the addData function

    expect(mockAdd).not.toHaveBeenCalled(); // Ensure that data was not added due to invalid GPS coordinates
});

// Test 4: Check if stored data is displayed correctly
test("should display stored data correctly", () => {
    const mockOpenCursor = jest.fn((callback) => {
        callback({
            target: {
                result: {
                    value: {
                        sensorReading: 100,
                        notes: "Test note",
                        latitude: 40.7128,
                        longitude: -74.006,
                        timestamp: new Date()
                    },
                    continue: jest.fn()
                }
            }
        });
    });

    mockIndexedDB.transaction().objectStore().openCursor.mockImplementation(mockOpenCursor);

    displayData(); // Trigger the displayData function

    expect(mockOpenCursor).toHaveBeenCalled(); // Ensure that cursor was opened
    expect(document.getElementById("display").innerHTML).not.toBe(""); // Ensure that data is displayed
});

// Test 5: Check if no data is stored
test("should display no data message when no data is available", () => {
    const mockOpenCursor = jest.fn((callback) => {
        callback({
            target: {
                result: null // No data
            }
        });
    });

    mockIndexedDB.transaction().objectStore().openCursor.mockImplementation(mockOpenCursor);

    displayData(); // Trigger the displayData function

    expect(mockOpenCursor).toHaveBeenCalled(); // Ensure that cursor was opened
    expect(document.getElementById("display").innerHTML).toBe("<p>No data stored.</p>"); // Ensure "No data stored" message is displayed
});
