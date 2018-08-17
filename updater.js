const util = require("util");
const exec = util.promisify(require("child_process").exec);
const versionNumberRegexp = /v([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{1,2})(?:\.([0-9]{1,2})){0,1}/g;


listRemoteTags("https://github.com/dashpay/dash").then(stdout => {
  const versions = parseVersionsTags(stdout);
  versions.sort(versionsSorter);
  console.log(versions[versions.length - 1].toString());
}).catch(err => {
  console.log(err);
});

function majorFilter(major) {
  return (o) => {
    return (o.major === major);
  };
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
  constructor(wallet,from,to) {
    this.wallet = wallet;
    this.from = from;
    this.to = to;
  }

  toString() {
    return 'updated ' + this.wallet + 'from ' + this.from + 'to ' + this.to;
  }
}
