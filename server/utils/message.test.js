var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jeff';
    var text = 'Message text';
    var message = generateMessage(from,text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from,text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate lat/lon coords url', () => {
    var from = 'Jeff';
    var latitude = 0;
    var longitude = 0;
    var url = 'https://www.google.com/maps?q=0,0';
    var message = generateLocationMessage(from,latitude,longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from,url});
  });
});
