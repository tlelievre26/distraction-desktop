const { InfluxDB } = require('@influxdata/influxdb-client');

const { appData } = require('../influxqueries');


jest.mock('@influxdata/influxdb-client', () => {
  const mockWriteApi = {
    writePoint: jest.fn(),
    close: jest.fn()
  };

  const mockQueryApi = {
    queryRows: jest.fn() 
  };

  return {
    InfluxDB: jest.fn().mockImplementation(() => ({
      getWriteApi: jest.fn().mockReturnValue(mockWriteApi),
      getQueryApi: jest.fn().mockReturnValue(mockQueryApi) 
    })),
    Point: jest.fn().mockImplementation(() => ({
      stringField: jest.fn().mockReturnThis(),
      timestamp: jest.fn().mockReturnThis(),
      tag: jest.fn().mockReturnThis()
    })),
    currentTime: {
      seconds: jest.fn().mockReturnValue(Date.now() / 1000)
    }
  };
});

// Your tests
describe('AppData function', () => {
  it('should call the writePoint method twice', () => {
    appData('Chrome', 'ExampleApp', 5);

    const mockWriteApi = new InfluxDB().getWriteApi();
      
  
    expect(mockWriteApi.writePoint).toHaveBeenCalledTimes(1);
  });
});


