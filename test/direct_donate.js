const assert = require('assert');
// instance of DirectDoante.sol contract in /contracts folder
const DirectDonate = artifacts.require('DirectDonate');

contract('DirectDonate', async (accounts) => {
  // deploy contract on testing network
  var directDonate;

  beforeEach(async () => {
    directDonate = await DirectDonate.new({ from: accounts[0] });
  });

  it('should deploy contract', async () => { });

  it('should store the deployer account as the owner', async () => {
    const owner = await directDonate.owner();

    assert.equal(owner, accounts[0]);
  });
});
