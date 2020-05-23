var rewire = require("rewire");
var module = rewire("./helpers.js");

const hashToKey = module.__get__('hashToKey');

describe("helpers", () => {
  describe("hashToKey()", () => {
    it('should hash text', () => {
      expect(hashToKey('Nieprawidłowe tagi')).toEqual('nieprawidowe_tagi');
    });
  });
});