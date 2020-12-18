const { TestScheduler } = require('jest')
const eventDB = require('./eventDB')

test("should throw an error if called without a user id", () => {
    expect(eventDB.getUsereventList()).toThrow('You must provide a user id');
  }
)