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

  it('should store 3 projects and send founds to receivers', async () => {
    const projects = [
      {
        name: 'KKL',
        receiver: accounts[1],
        url: 'https://kklweb.org'
      },
      {
        name: 'unicef',
        receiver: accounts[2],
        url: 'https://unicef.org'
      },
      {
        name: 'KKL',
        receiver: accounts[3],
        url: 'https://ymca.org'
      }
    ];

    for (const project of projects) await directDonate.addProject(project.name, project.receiver, project.url);

    for (const i of [0, 1, 2]) {
      const project = await directDonate.projects(i);

      assert.equal(project[0], projects[i].name);
      assert.equal(project[1], projects[i].receiver);
      assert.equal(project[2], projects[i].url);

      const getReceiverBalance = async () => await web3.eth.getBalance(projects[i].receiver);

      const previousBalance = await getReceiverBalance();
      const value = 1e18;

      await directDonate.donate(i, { from: accounts[4], value });

      const balance = await getReceiverBalance();

      assert.equal(balance, previousBalance.toNumber() + value);
    }
  });

  it('should return project\'s donors', async () => {
    await addProject();

    await directDonate.donate(0, { from: accounts[2], value: 1e18 });

    var donors = await directDonate.donors(0);

    assert.equal(donors.length, 1);
    assert.equal(donors[0], accounts[2]);

    await directDonate.donate(0, { from: accounts[3], value: 1e18 });

    donors = await directDonate.donors(0);

    assert.equal(donors.length, 2);
    assert.equal(donors[0], accounts[2]);
    assert.equal(donors[1], accounts[3]);
  });

  it('should return project\'s donations', async () => {
    await addProject();

    const value = 1e18;
    await directDonate.donate(0, { from: accounts[2], value });

    var donations = await directDonate.donations(0);

    assert.equal(donations.length, 1);
    assert.equal(donations[0], value);
  });
});
