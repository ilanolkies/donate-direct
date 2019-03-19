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

  it('should begin with no projects', async () => {
    const projectQuantity = await directDonate.projectIndex();

    assert.equal(projectQuantity, 0);
  });

  it('should add a project', async () => {
    const previousQuantity = await directDonate.projectIndex();

    await directDonate.addProject('', '', '');

    const projectQuantity = await directDonate.projectIndex();

    assert.equal(projectQuantity, previousQuantity.toNumber() + 1);
  });

  it('should add and return the project', async () => {
    const projectName = 'NewProject';

    await directDonate.addProject(projectName, '', '');

    const project = await directDonate.projectName(0);

    assert.equal(project, projectName);
  });

  const projectName = 'NewProject';
  const projectReceiver = accounts[1];
  const projectUrl = 'https://www.kklweb.org/';

  const addProject = async () => {
    await directDonate.addProject(projectName, projectReceiver, projectUrl);
  }

  it('should store the project\'s address and url', async () => {
    await addProject();

    const project = await directDonate.projects(0);

    assert.equal(project[0], projectName);
    assert.equal(project[1], projectReceiver);
    assert.equal(project[2], projectUrl);
  });

  it('should send founds to receiver', async () => {
    await addProject();

    const receiver = (await directDonate.projects(0))[1];
    const getReceiverBalance = async () => await web3.eth.getBalance(receiver);

    const previousBalance = await getReceiverBalance();
    const value = 10e18;

    await directDonate.donate(0, { value });

    const balance = await getReceiverBalance();

    assert.equal(balance, previousBalance.toNumber() + value);
  });
});
