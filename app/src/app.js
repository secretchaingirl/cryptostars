// Import the page's CSS. Webpack will know what to do with it.
import './styles/app.css'

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

    App.clearStatus('claimStatusId');

    try {
        let star = await instance.lookUptokenIdToStarInfo(id);
        App.setStatus('claimStatusId', 'Sorry, that CryptoStar has already been claimed.');
    } catch (err) {
        // Star Id hasn't already been claimed, so claim it
        await instance.claimStar(name, id, {from: account});
        App.setStatus('claimStatusId', "CryptoStar claimed by: " + account + ".");
    }
}

// Lookup a CryptoStar by ID
const findCryptoStar = async () => {
    const instance = await CryptoStar.deployed();
    const id = document.getElementById("cryptoStarIdForLookup").value;

    App.clearStatus('findStatusId');

    try {
        const v = await instance.lookUptokenIdToStarInfo(id);
        const name = v[0].toString();
        const owner = v[1].toString();
        App.setStatus('findStatusId', "CryptoStar name: " + name + ". Owner: " + owner);
    } catch(err) {
        App.setStatus('findStatusId', 'Unable to find CryptoStar: ' + id);
    }
}

// Exchange CryptoStars
const exchangeCryptoStars = async () => {
    const instance = await CryptoStar.deployed();
    const id1 = document.getElementById("cryptoStarId1").value;
    const id2 = document.getElementById("cryptoStarId2").value;

    App.clearStatus('exchangeStatusId');

    await instance.exchangeStars(id1, id2, {from: account});

    App.setStatus('exchangeStatusId', "CryptoStars exchanged OK!");
}

// Transfer CryptoStar ownership
const transferCryptoStar = async () => {
    const instance = await CryptoStar.deployed();
    const id = document.getElementById("cryptoStarIdForTransfer").value;
    const accountTo = document.getElementById("cryptoOwnerForTransfer").value;

    App.clearStatus('transferStatusId');

    await instance.transferStar(accountTo, id, {from: account});

    App.setStatus('transferStatusId', "CryptoStar transferred OK!");
}

const App = {
  start: function () {

    const self = this;

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

  clearStatus: function(id) {
    document.getElementById(id).innerHTML = '';
  },

  setStatus: function (id, message) {
    document.getElementById(id).innerHTML = message;
  },

  claimCryptoStar: function () {
    claimCryptoStar();
  },

  findCryptoStar: function () {
    findCryptoStar();
  },

  exchangeCryptoStars: function () {
      exchangeCryptoStars();
  },

  transferCryptoStar: function () {
      transferCryptoStar();
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
