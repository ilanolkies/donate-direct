const assert = require('assert');
// instance of DirectDoante.sol contract in /contracts folder
const DirectDonate = artifacts.require('DirectDonate');

contract('DirectDonate', async (accounts) => {
  it('should deploy contract', async () => {
    await DirectDonate.new();
  });
});
