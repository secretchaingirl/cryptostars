# CryptoStars - Udacity Project
*a decentralized Star Notary*

CryptoStars is an Ethereum Dapp implemented using Truffle v5

> Contract Address: 0xe368113C9f99705a6a5B4bFE2d93d0d821065A99

> ERC-721 Token Name
> 
	CryptoStar
> 
> ERC-721 Token Symbol
> 
	CST
> 

Things you can do with the **CryptStars Dapp**:

 - claim a star
 - find a star that's been claimed
 - exchange stars (*two people can exchange their CryptoStar tokens*)
 - transfer a star

## Getting Started
`npm install -g truffle`

This repository uses:

 - Truffle v5.0.1
 - Solidity (solc) v0.4.24
 - OpenZeppelin-Solidity v2.0.0

### Installation

 1. Clone the repository
 ```
 $ git clone [repo]
 ```

 2. Install NPM packages at top-level needed for truffle contracts and unit tests
```
$ npm run build
```

 3. Install Webpack and other NPM packages needed for Dapp front-end
 
 ```
 $ cd app
 $ npm run build
 ```

### Running the CryptoStars Dapp (locally)

 1. Run the truffle development environment
 ```
 $ truffle develop
 ```
 
 2. Compile the contracts and migrate from within `truffle develop`
 ```
compile
migrate
 ```
 
 3. Run the contract unit tests *(optional)* from within `truffle develop`
 ```
test
```
 4. In another terminal run the Webpack development server (**not from** `truffle develop`)
 ```
 $ cd app
 $ npm run dev
 ```
 
 5. Setup your MetaMask by adding a *Custom RPC* pointing to the Truffle development network: *http://localhost:9545*
 
 6. Add a few accounts to MetaMask using the private key import feature
 
 7. Open browser and go to *http://localhost:8080*
 
 8. You're all set to try claiming, finding, exchanging, and transferring  CryptoStars!

 ### Running the CryptoStars Dapp (on the Rinkeby Test Network)

 1. Modify the `rinkeby` netwoprk configuration in `truffle-config.js` and set the `HDWalletProvider` values

 Or use the current `truffle-config.js` setup and create the `.mnemonic` and `.infuraKey` files under the main repo location:

    a. Add your Metamask seed words to `.mnemonic`
    b. Create an *Infura.io* project and add the project ID to `.mnemonic`

 2. Setup Metamask to point to the Rinkeby network
 
 3. Add the CST custom token to your Rinkeby account(s)

 4. Open a terminal window and run the Webpack development server
 ```
 $ cd app
 $ npm run dev
 ```
 
 6. Open browser and go to *http://localhost:8080*

## FAQ
This repo was initially created using `truffle unbox webpack` which is a marriage of [Truffle](http://truffleframework.com/) and a [Webpack](https://webpack.js.org/) setup.

## Acknowledgements
The repo has been adapted from the Udacity *decentralized star notary* boiler plate starter code:  [https://github.com/udacity/boilerPlateDAPPproject](https://github.com/udacity/boilerPlateDAPPproject "https://github.com/udacity/boilerPlateDAPPproject")

## License
MIT


> Written with [StackEdit](https://stackedit.io/).
