const DirectDonate = artifacts.require('DirectDonate');

var expect = require('chai')
.use(require('bn-chai')(web3.utils.BN))
.expect;

contract('DirectDonate', async (accounts) => {
  var directDonate;

  beforeEach(async () => {
    directDonate = await DirectDonate.new({ from: accounts[0] });
  });

  it('should deploy contract', async () => { });

  it('should begin with no projects', async () => {
    const projectQuantity = await directDonate.projectIndex();

    expect(projectQuantity).to.eq.BN(web3.utils.toBN(0));
  });

  const projectName = 'NewProject';
  const projectReceiver = accounts[1];
  const projectUrl = 'https://www.kklweb.org/';

  it('should add a project', async () => {
    const previousQuantity = await directDonate.projectIndex();

    await directDonate.addProject(projectName, projectReceiver, projectUrl);

    const projectQuantity = await directDonate.projectIndex();

    expect(projectQuantity).to.eq.BN(previousQuantity.add(web3.utils.toBN(1)));
  });

  it('should add and return the project', async () => {
    await directDonate.addProject(projectName, projectReceiver, projectUrl);

    const project = await directDonate.projectName(0);

    expect(project).to.eq.string(projectName);
  });

  const addProject = async () => {
    await directDonate.addProject(projectName, projectReceiver, projectUrl);
  }

  it('should store the project\'s address and url', async () => {
    await addProject();

    const project = await directDonate.projects(0);

    expect(project[0]).to.eq.string(projectName);
    expect(project[1]).to.eq.string(projectReceiver);
    expect(project[2]).to.eq.string(projectUrl);
  });

  it('should send founds to receiver', async () => {
    await addProject();

    const receiver = (await directDonate.projects(0))[1];
    const getReceiverBalance = async () => await web3.eth.getBalance(receiver);

    const previousBalance = await getReceiverBalance();
    const value = web3.utils.toBN(10e18);

    await directDonate.donate(0, { value });

    const balance = await getReceiverBalance();

    expect(balance).to.eq.BN(web3.utils.toBN(previousBalance).add(value));
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

      expect(project[0]).to.eq.string(projects[i].name);
      expect(project[1]).to.eq.string(projects[i].receiver);
      expect(project[2]).to.eq.string(projects[i].url);

      const getReceiverBalance = async () => await web3.eth.getBalance(projects[i].receiver);

      const previousBalance = await getReceiverBalance();
      const value = web3.utils.toBN(1e18);

      await directDonate.donate(i, { from: accounts[4], value });

      const balance = await getReceiverBalance();

      expect(balance).to.eq.BN(web3.utils.toBN(previousBalance).add(value));
    }
  });

  it('should return project\'s donors', async () => {
    await addProject();

    await directDonate.donate(0, { from: accounts[2], value: 1e18 });

    var donors = await directDonate.donors(0);

    expect(donors).to.have.lengthOf(1);
    expect(donors[0]).to.eq.string(accounts[2]);

    await directDonate.donate(0, { from: accounts[3], value: 1e18 });

    donors = await directDonate.donors(0);

    expect(donors).to.have.lengthOf(2);
    expect(donors[0]).to.eq.string(accounts[2]);
    expect(donors[1]).to.eq.string(accounts[3]);
  });

  it('should return project\'s donations', async () => {
    await addProject();

    const value = web3.utils.toBN(1e18);
    await directDonate.donate(0, { from: accounts[2], value });

    var donations = await directDonate.donations(0);

    expect(donations).to.have.lengthOf(1);
    expect(donations[0]).to.eq.BN(value);
  });
});
