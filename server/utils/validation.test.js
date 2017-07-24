const expect = require('expect');

var {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should only accept non-space strings', () => {
    var res = isRealString('jeff');

    expect(res).toBe(true);
    });
    it('should reject strings with only spaces', () => {
      var res = isRealString('    ');

      expect(res).toBe(false);
      });
      it('should reject non-string values', () => {
        var res = isRealString(42);

        expect(res).toBe(false);
        });
});
