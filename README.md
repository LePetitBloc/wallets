# wallets.json
Cryptocurrencies core wallets configuration map in json, with ready to deploy images.

> This map is strongly focused on **technicals details** and **masternodes** coins.

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
npm install --save wallets.json
```

Either on **node** or the **browser** (with `webpack`) it get as simple as this:

**ES5**
```
const wallets = require('wallets.json');
```

**ES6**
```
import wallets from 'wallets.json';
```

> Since webpack >= v2.0.0, importing of JSON files will work by default.

## Contribute

Feel free to...
* add more wallets to the list
* submitting an adapter for other languages (Python, Ruby, etc...)
* add **DockerHub** link to a ready to run image
* ...

...by submitting a Pull Request.

## Licence
MIT
