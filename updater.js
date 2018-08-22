require("dotenv").config();
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const versionNumberRegexp = /([vV])?([0-9]{1,2})\.([0-9]{1,2})(?:\.([0-9]{1,2}))?(?:\.([0-9]{1,2}))?[\n|\s]?/g;
const wallets = require("./wallets");
const writeFile = util.promisify(require("fs").writeFile);
const manifest = require("./package");

class Version {
  constructor(versionRegexpResult) {
    this.prefix = versionRegexpResult[1] || "";
    this.major = parseInt(versionRegexpResult[2]);
    this.minor = parseInt(versionRegexpResult[3]);
    this.patch = versionRegexpResult[4] ? parseInt(versionRegexpResult[4]) : null;
    this.fourth = versionRegexpResult[5] ? parseInt(versionRegexpResult[5]) : null;
  }

  static fromVersionString(versionString) {
    if (typeof versionString === "string") {
      versionNumberRegexp.lastIndex = 0;
      let regexpResult = versionNumberRegexp.exec(versionString);
      if (regexpResult) {
        return new Version(regexpResult);
      }
    }

    throw new Error("Can't parse version string : syntax error");
  }

  toString() {
    let string = this.prefix + this.major + "." + this.minor;
    string += this.patch !== null ? "." + this.patch : "";
    string += this.fourth !== null ? "." + this.fourth : "";
    return string;
  }
}

class Update {
  constructor(walletIdentifier, from, to) {
    this.walletIdentifier = walletIdentifier;
    this.from = from;
    this.to = to;
  }

  toString() {
    return "updated " + this.walletIdentifier + " from " + this.from.toString() + " to " + this.to.toString();
  }
}

(async function() {
  try {
    console.log("--- Wallet updater launched at " + new Date() + "--");
    let updates = await checkAllForUpdates();

    if (updates.filter(o => { return o !== null; }).length > 0) {
      await updateFile(updates);
      await updatePatchNumber();

      const commitMessage = buildCommitMessage(updates);

      await addDeployKey();
      await addChanges();
      await commit(commitMessage);
      await tag(commitMessage);
      await push();
      await publish();
    } else {
      console.log("Wallets are up to date.");
    }

    console.log("--- Wallet updater ended at " + new Date() + "--");
  } catch (e) {
    console.error(e);
  }
})();


async function addDeployKey() {
  if (!process.env.deploy_key) {
    throw new Error("Environment variable deploy_key is not set - cannot send modifications to server.");
  }
  const { stdout, stderr } = await exec("eval \"$(ssh-agent -s)\" && echo $deploy_key | ssh-add -");
  console.log(stdout);
  console.log(stderr);
}

async function addChanges() {
  const { stdout } = await exec("git add wallets.json package.json");
  console.log(stdout);
}

async function commit(message) {
  const { stdout } = await exec("git commit -m \"" + message + "\"");
  console.log(stdout);
}

async function tag(message) {
  const { stdout } = await exec("git tag " + manifest.version + " -m \" " + message + "\"");
  console.log(stdout);
}

async function push() {
  const { stderr } = await exec("git push --follow-tags origin HEAD");
  console.log(stderr);
  console.log("Updated wallet.json successfully");
}

function buildCommitMessage(updates) {
  let commitMessage = "Update wallet.json\n\n";
  updates.forEach(update => {
    if (update) {
      commitMessage += update.toString() + "\n";
    }
  });
  return commitMessage;
}

async function updateFile(updates) {
  updates.forEach(update => {
    if (update) {
      wallets[update.walletIdentifier].tag = update.to.toString();
    }
  });
  return writeFile("./wallets.json", JSON.stringify(wallets, null, "  "));
}

async function checkAllForUpdates() {
  const pendingUpdates = [];
  for (let property in wallets) {
    if (wallets.hasOwnProperty(property)) {
      pendingUpdates.push(checkForUpdates(wallets[property], property));
    }
  }
  return Promise.all(pendingUpdates);
}

async function checkForUpdates(wallet, identifier) {
  const tags = await listRemoteTags(wallet.repository);
  let versions = parseVersionsTags(tags);
  const currentVersion = findCurrentVersion(wallet, identifier);
  if (currentVersion) {
    versions = versions.filter(superiorVersionsFilter(currentVersion));
    versions = versions.sort(versionsSorter);

    if (versions.length > 0) {
      const targetVersion = versions[versions.length - 1];
      return new Update(identifier, currentVersion, targetVersion);
    }
  }
  return null;
}

function findCurrentVersion(wallet, identifier) {
  try {
    return Version.fromVersionString(wallet.tag);
  }catch (e) {
    console.warn("Can't determined current version for wallet : " + identifier + " missing tag");
    return null;
  }
}

async function publish() {
  if (!process.env.NPM_TOKEN) {
    throw new Error("Environment variable NPM_TOKEN is not set - cannot publish package.");
  }
  try {
    await exec("npm whoami");
  } catch (e) {
    throw new Error("Something went wrong authenticating you on npm - Check your NPM_TOKEN validity");
  }

  const { stdout } = await exec("npm publish");
  console.log(stdout);
  return stdout;
}

async function updatePatchNumber() {
  const currentVersion = Version.fromVersionString(manifest.version);
  currentVersion.patch += 1;

  manifest.version = currentVersion.toString();
  return writeFile("./package.json", JSON.stringify(manifest, null, "  "));
}


function superiorVersionsFilter(currentVersion) {
  return version => {
    if (version.major === currentVersion.major) {
      if (version.minor > currentVersion.minor) {
        return 1;
      } else if (version.minor === currentVersion.minor) {
        if (version.patch > currentVersion.patch) {
          return 1;
        } else if (version.patch === currentVersion.patch) {
          if (version.fourth > currentVersion.fourth) {
            return 1;
          }
        }
      }
    }
    return 0;
  };
}

function versionsSorter(a, b) {
  if (
    a.major > b.major ||
    (a.major >= b.major && a.minor > b.minor) ||
    (a.major >= b.major && a.minor >= b.minor && a.patch > b.patch) ||
    (a.major >= b.major && a.minor >= b.minor && a.patch >= b.patch && a.fourth > b.fourth)
  ) {
    return 1;
  } else {
    return -1;
  }
}

function parseVersionsTags(tagLists) {
  const versions = [];
  let version = {};
  versionNumberRegexp.lastIndex = 0;
  while ((version = versionNumberRegexp.exec(tagLists))) {
    versions.push(new Version(version));
  }
  return versions;
}

async function listRemoteTags(remote) {
  const { stdout } = await exec("git ls-remote --tags " + remote);
  return stdout;
}


