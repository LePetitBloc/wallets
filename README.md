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

## Donation

If you have not already understand, we love cryptocurrency. It's possible to make a donation
for this work at the following addresses:

| Currency         | Address                                    |
| ---------------- | ------------------------------------------ |
| Bitcoin          | 14VRBrDZ47HR1pWjmAnyC5CJCXDkhLeANb         |
| Ethereum         | 0x1accf4c2bd6010100a2aeac36f336fb963a1716a |
| Ethereum Classic | 0x3b33bdcc70f06dad7068594a0cd8fbfd7b203aae |
| Litecoin         | LdH6Sbq5M9p6dqG7GaRvBjoCqJ2CHnz9wr         |
| Dash             | XuPyN4Ns12qaMKzUjffzeKrCjCL4XYwUCY         |
| ZCash            | t1U2e4TV6zmg6gXAByBp59NtBP2HsEvY5T5        |
| Doge             | DKbojeYrguCL2Suh9ujmU49m4QK9DixBXL         |

## Code of conduct

See the [CODE OF CONDUCT](CODE_OF_CONDUCT.md) file.

## Contributing

See the [CONTRIBUTING](CONTRIBUTING.md) file.

## License

This project is under the [MIT License](LICENSE.md).

## Support

See the [SUPPORT](SUPPORT.md) file.

## Credits

- README, CONTRIBUTING and LICENSE are heavily inspired by [project-template](https://github.com/mnapoli/project-template)
- Issue and Pull Request templates comes from [Open-Source Templates](https://www.talater.com/open-source-templates/#/)
- CODE_OF_CONDUCT come from [Contributor Covenant](https://www.contributor-covenant.org)
