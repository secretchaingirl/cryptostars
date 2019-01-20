// Import the page's CSS. Webpack will know what to do with it.
//import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import CryptoStarArtifact from '../../build/contracts/CryptoStar.json'

// CryptoStar is our usable abstraction, which we'll use through the code below.
const CryptoStar = contract(CryptoStarArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

// Get token name and symbol
const getTokenInfo = async () => {
    const instance = await CryptoStar.deployed();
    const tokenName = await instance.name.call();
    const tokenSymbol = await instance.symbol.call();

    App.setTokenInfo(tokenName, tokenSymbol);
}

// Claim a new CryptoStar
const claimCryptoStar = async () => {
    const instance = await CryptoStar.deployed();
    const name = document.getElementById("cryptoStarName").value;
    const id = document.getElementById("cryptoStarId").value;
    await instance.claimStar(name, id, {from: account});

    App.setStatus("CryptoStar claimed by: " + account + ".");
}

// Lookup a CryptoStar by ID
const findCryptoStar = async () => {
    const instance = await CryptoStar.deployed();
    const id = document.getElementById("cryptoStarIdForLookup").value;
    const name = await instance.lookUptokenIdToStarInfo(id);

    App.setStatus("CryptoStar name: " + name + ".");
}

const App = {
  start: function () {
    const self = this

    // Bootstrap the CryptoStar abstraction for Use.
    CryptoStar.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      self.getTokenInfo();
    })
  },

  getTokenInfo: function () {
    getTokenInfo();
  },

  setTokenInfo: function (tokenName, tokenSymbol) {
    document.getElementById('tokenName').innerHTML = tokenName;
    document.getElementById('tokenSymbol').innerHTML = tokenSymbol;
  },

  setStatus: function (message) {
    document.getElementById('status').innerHTML = message;
  },

  claimCryptoStar: function () {
    claimCryptoStar();
  },

  findCryptoStar: function () {
    findCryptoStar();
  }

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 ether,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
