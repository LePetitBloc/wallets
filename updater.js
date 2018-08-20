require('dotenv').config();
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const versionNumberRegexp = /([vV])?([0-9]{1,2})\.([0-9]{1,2})(?:\.([0-9]{1,2}))?(?:\.([0-9]{1,2}))?[\n|\s]?/g;
const wallets = require('./wallets');
const writeFile = util.promisify(require('fs').writeFile);

  (async function() {
    let updates = await checkAllForUpdates();
    await updateFile(updates);
    await addDeployKey();
    await addChanges();
    await commit(buildCommitMessage(updates));
    await push()
  })().catch(err => {
    console.error(err);
  });

async function addDeployKey() {
  if(!process.env.deploy_key) {
    throw new Error('Environment variable deploy_key is not set - cannot send modifications to server.');
  }
  const {stdout, stderr} = await exec('eval "$(ssh-agent -s)" && echo $deploy_key | ssh-add -');
  console.log(stdout);
  console.log(stderr);
}

async function addChanges() {
  const {stdout, stderr} = await exec('git add wallets.json');
  console.log(stdout);
  if(stderr) {
    throw  new Error(stderr);
  }
}

async function commit(message) {
  const {stdout, stderr} = await exec('git commit -m "' + message +'"');
  console.log(stdout);
  if(stderr) {
    throw  new Error(stderr);
  }
}

async function push() {
  const {stdout, stderr} = await exec('git push origin HEAD');
  if(stderr) {
    throw new Error(stderr);
  } else {
    console.log(stdout);
    console.log('Updated wallet.json successfully')
  }
}

function buildCommitMessage(updates) {
  let commitMessage = 'Update wallet.json\n\n';
  updates.forEach((update) => {
    if(update) {
      commitMessage += update.toString() + '\n';
    }
  });
  return  commitMessage;
}

async function updateFile(updates) {
  updates.forEach(update => {
    if(update) {
      wallets[update.walletIdentifier].tag = update.to.toString();
    }
  });
  return writeFile('./wallets.json', JSON.stringify(wallets,null, '  '));
}

async function checkAllForUpdates() {
  const pendingUpdates = [];
  for (let property in wallets) {
    if(wallets.hasOwnProperty(property)) {
      pendingUpdates
        .push(checkForUpdates(wallets[property], property).catch(err => {
          console.error(err.message);
        }));
    }
  }
  return Promise.all(pendingUpdates);
}

async function checkForUpdates(wallet, identifier) {
  const tags = await listRemoteTags(wallet.repository);
  let versions = parseVersionsTags(tags);
  const currentVersion = findCurrentVersion(wallet);

  versions = versions.filter(superiorVersionsFilter(currentVersion));
  versions = versions.sort(versionsSorter);

  if(versions.length > 0) {
    const targetVersion = versions[versions.length - 1];
    return new Update(identifier,currentVersion,targetVersion);
  }
  return null;
}

function findCurrentVersion(wallet) {
  if(wallet.tag) {
    let regexpResult = versionNumberRegexp.exec(wallet.tag);
    if (regexpResult) {
      return new Version(regexpResult);
    }
  }

  throw new Error("Can't determined current version for wallet : " + wallet.identifier);
}

function superiorVersionsFilter(currentVersion) {
  return (version) => {
    if(version.major === currentVersion.major) {
      if(version.minor > currentVersion.minor) {
         return 1;
      } else if(version.minor === currentVersion.minor) {
        if(version.patch > currentVersion.patch) {
          return 1;
        } else if(version.patch === currentVersion.patch) {
          if(version.fourth > currentVersion.fourth) {
            return 1;
          }
        }
      }
    }
    return 0;
  }
}

function versionsSorter(a, b) {
  if (a.major > b.major
    || (a.major >= b.major && a.minor > b.minor)
    || (a.major >= b.major && a.minor >= b.minor && a.patch > b.patch)
    || (a.major >= b.major && a.minor >= b.minor && a.patch >= b.patch) && a.fourth > b.fourth) {
    return 1;
  } else {
    return -1;
  }
}

function parseVersionsTags(tagLists) {
  const versions = [];
  let version = {};
  while (version = versionNumberRegexp.exec(tagLists)) {
    versions.push(new Version(version));
  }
  return versions;
}

async function listRemoteTags(remote) {
  const {stdout, stderr} = await exec("git ls-remote --tags " + remote);
  if (typeof stdout === "string") {
    return stdout;
  } else if (typeof stderr === "string") {
    return Promise.reject(stderr);
  }
}

class Version {
  constructor(versionRegexpResult) {
    this.prefix = versionRegexpResult[1] || '';
    this.major = parseInt(versionRegexpResult[2]);
    this.minor = parseInt(versionRegexpResult[3]);
    this.patch = versionRegexpResult[4] ? parseInt(versionRegexpResult[4]) : null;
    this.fourth = versionRegexpResult[5] ? parseInt(versionRegexpResult[5]) : null;
  }

  toString() {
    let string =  this.prefix + this.major + '.' + this.minor;
    string += ((this.patch !== null ) ? '.' + this.patch : '');
    string += ((this.fourth !== null) ? '.' +  this.fourth : '');
    return string;
  }
}

class Update {
  constructor(walletIdentifier,from,to) {
    this.walletIdentifier = walletIdentifier;
    this.from = from;
    this.to = to;
  }

  toString() {
    return 'updated ' + this.walletIdentifier + ' from ' + this.from.toString() + ' to ' + this.to.toString();
  }
}
