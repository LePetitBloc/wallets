const util = require("util");
const exec = util.promisify(require("child_process").exec);
const versionNumberRegexp = /v([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{1,2})(?:\.([0-9]{1,2})){0,1}/g;
const wallets = require('./wallets');
const updates = [];

wallets.Zerocoin.identifier = 'Zerocoin';

checkForUpdates(wallets.Zerocoin).then(() => {
  console.log(updates[0].toString());
});

async function checkForUpdates(wallet) {
  const tags = await listRemoteTags(wallet.repository);
  let versions = parseVersionsTags(tags);
  const currentVersion = findCurrentVersion(wallet);

  versions = versions.filter(superiorVersionsFilter(currentVersion));
  versions = versions.sort(versionsSorter);

  if(versions.length > 0) {
    const targetVersion = versions[versions.length - 1];
    updates.push(new Update(wallet.identifier,currentVersion,targetVersion));
  }
  return true;
}

function findCurrentVersion(wallet) {
  if(wallet.tag) {
    let regexpResult = versionNumberRegexp.exec(wallet.tag);
    if (regexpResult) {
      return new Version(regexpResult);
    }
  }

  throw new Error("Can't determined current version for wallet : " + wallet.name);
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
    this.major = parseInt(versionRegexpResult[1]);
    this.minor = parseInt(versionRegexpResult[2]);
    this.patch = parseInt(versionRegexpResult[3]);
    this.fourth = versionRegexpResult[4] ? parseInt(versionRegexpResult[4]) : null;
  }

  toString() {
    return "v" + this.major + "." + this.minor + "." + this.patch + "." + this.fourth;
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
