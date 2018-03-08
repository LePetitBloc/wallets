# Masternodes
Open masternodes map with configuration details and ready to deploy images.

## Data structure
```
...
  "Dash": {
    "parent": "Bitcoin",
    "walletSrc": "https://github.com/dashpay/dash",
    "baseBinary": "dash",
    "basedir": ".dashcore/",
    "configFile": "dash.conf",
    "mainnetPort": 9999,
    "mainRpcPort": 9998,
    "testnetPort": 19999,
    "testnetRpcPort": 19998,
    "requiredTokens": 1000,
    "bdbVersion": "4.8.30.NC",
    "symbol": "DASH",
    "masternode": true,
    "proofType": "",
    "image": "",
    "imageSrc": ""
  },
...
```

## Install & Usage

### Javascript
```
npm install --save masternodes
```

Either on **node** or the **browser** (with `webpack`) it get as simple as this:

**ES5**
```
const masternodes = require('masternodes');
```

**ES6**
```
import masternodes from 'masternodes';
```

> Since webpack >= v2.0.0, importing of JSON files will work by default.

## Contribute

Feel free to:
* add more coins to the list
* submitting an adapter for other languages (Python, Ruby, etc...)
* add **DockerHub** link to a ready to run image
* ...

by submitting a Pull Request.

## Licence
MIT
