import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the IndexedDB API
const mockOpen = jest.fn();
const mockTransaction = jest.fn();
const mockObjectStore = jest.fn();
const mockCursor = jest.fn();

beforeAll(() => {
    global.indexedDB = {
        open: mockOpen,
    };
});

beforeEach(() => {
    mockOpen.mockClear();
    mockTransaction.mockClear();
    mockObjectStore.mockClear();
    mockCursor.mockClear();
});

// Mock data
const mockData = {
    sensorReadings: [25.3, 60.7],
    cropPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
    farmerNote: "Observed good growth, but some areas are dry.",
    gpsCoordinates: 40.7128,
    timestamp: new Date(),
};

test('renders Agriculture App title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Agriculture App/i);
    expect(titleElement).toBeInTheDocument();
});

test('opens IndexedDB and stores data', async () => {
    // Mock IndexedDB behavior
    mockOpen.mockImplementation(() => ({
        onupgradeneeded: jest.fn(),
        onsuccess: jest.fn((event) => {
            const db = {
                transaction: () => ({
                    objectStore: () => ({
                        add: jest.fn((data) => {
                            expect(data).toEqual(mockData); // Check if the data stored is correct
                            return { onsuccess: jest.fn() }; // Simulate success
                        }),
                    }),
                }),
            };
            event.target.result = db;
            mockOpen.mock.calls[0][1].onsuccess(event); // Trigger onsuccess
        }),
        onerror: jest.fn(),
    }));

    render(<App />);
    
    expect(mockOpen).toHaveBeenCalledWith('AgricultureDB', 1);
    expect(mockOpen).toHaveBeenCalledTimes(1);
});

test('retrieves data from IndexedDB and logs it', async () => {
    // Mock IndexedDB retrieval
    mockOpen.mockImplementation(() => ({
        onsuccess: jest.fn((event) => {
            const db = {
                transaction: () => ({
                    objectStore: () => ({
                        openCursor: () => ({
                            onsuccess: jest.fn((event) => {
                                event.target.result = { value: mockData, continue: jest.fn() };
                                event.target.result.continue(); // Move to next record
                            }),
                        }),
                    }),
                }),
            };
            event.target.result = db;
            mockOpen.mock.calls[0][1].onsuccess(event); // Trigger onsuccess
        }),
        onerror: jest.fn(),
    }));

    console.log = jest.fn(); // Mock console.log

    render(<App />);
    
    expect(console.log).toHaveBeenCalledWith("Sensor Readings:", mockData.sensorReadings);
    expect(console.log).toHaveBeenCalledWith("Crop Photo (Base64 String):", mockData.cropPhoto);
    expect(console.log).toHaveBeenCalledWith("Farmer Note:", mockData.farmerNote);
    expect(console.log).toHaveBeenCalledWith("GPS Coordinates:", mockData.gpsCoordinates);
    expect(console.log).toHaveBeenCalledWith("Timestamp:", mockData.timestamp);
});
