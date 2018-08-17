const { exec } = require("child_process");
const versionNumberRegexp = /v([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{1,2})(?:\.([0-9]{1,2})){0,1}/g;


listRemoteTags("https://github.com/dashpay/dash").then(stdout => {
  const versions = parseVersionsTags(stdout);
  versions.sort(versionsSorter);
  console.log(versions[versions.length - 1].toString());
}).catch(err => {
  console.log(err);
});

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

function listRemoteTags(remote) {
  return new Promise((resolve, reject) => {
    exec("git ls-remote --tags " + remote, (err, stdout, stderr) => {
      if (typeof stdout === "string") {
        resolve(stdout);
      } else if (typeof stderr === "string") {
        reject(stderr);
      } else {
        reject(err);
      }
    });
  });
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
