// Import the function
const { AppData } = require('./influxqueries.js'); // Adjust the path as necessary

// Mock the necessary dependencies
const client = require('./client');
const { Point } = require('@influxdata/influxdb-client');
const currentTime = require('./currentTime');

jest.mock('./client', () => ({
  getWriteApi: jest.fn(),
}));

jest.mock('@influxdata/influxdb-client', () => ({
  Point: jest.fn().mockImplementation(() => ({
    stringField: jest.fn().mockReturnThis(),
    timestamp: jest.fn().mockReturnThis(),
    tag: jest.fn().mockReturnThis(),
  })),
}));

jest.mock('./currentTime', () => ({
  seconds: jest.fn(),
}));

describe('AppData', () => {
  it('should create a point and write it using the write client', () => {
    // Arrange
    const writeClientMock = {
      writePoint: jest.fn(),
      close: jest.fn(),
    };
    client.getWriteApi.mockReturnValue(writeClientMock);
    currentTime.seconds.mockReturnValue(1234567890);

    // Act
    AppData('TestSource', 'TestApp', 'TestSession');

    // Assert
    expect(writeClientMock.writePoint).toHaveBeenCalled();
    expect(writeClientMock.close).toHaveBeenCalled();
  });
});
