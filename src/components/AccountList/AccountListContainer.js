import React, { Component } from 'react'
import AccountList from 'components/AccountList/AccountList'
import AccountSystemList from 'components/AccountList/AccountSystemList'
import SendCoin from 'components/SendCoin/SendCoin'

import MetaCoin from 'contracts/MetaCoin.sol';
import Web3 from 'web3';


class AccountListContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accounts: [],
      systemAccounts: [],
      coinbase: ''
    }

    this._getAccountBalance = this._getAccountBalance.bind(this)
    this._getAccountBalances = this._getAccountBalances.bind(this)
    this._getSystemAccountBalances = this._getSystemAccountBalances.bind(this)
  }

  componentWillMount(){
    MetaCoin.setProvider(this.props.web3.currentProvider);    
  }

  _getAccountBalance (account) {
    var meta = MetaCoin.deployed()
    return new Promise((resolve, reject) => {
      meta.getBalance.call(account, {from: account}).then(function (value) {
        resolve({ account: value.valueOf() })
      }).catch(function (e) {
        console.log(e)
        reject()
      })
    })
  }

  _getAccountBalances () {
    this.props.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        window.alert('There was an error fetching your accounts.')
        console.error(err)
        return
      }

      if (accs.length === 0) {
        window.alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      var accountsAndBalances = accs.map((account) => {
        return this._getAccountBalance(account).then((balance) => { return { account, balance } })
      })

      Promise.all(accountsAndBalances).then((accountsAndBalances) => {
        this.setState({accounts: accountsAndBalances})
      })
    }.bind(this))
  }

    _getSystemAccountBalances () {
      var meta = MetaCoin.deployed()
      var systemAccountsAndBalances = new Promise((resolve, reject) => {
        meta.getAllAccountsAndBalances.call().then(function (accounts) {
        var addresses = accounts[0].map(function (item) { 
          return [item]
        });
        var balances = accounts[1].map(function (item) { 
          return [item]
        });

      var newArray = new Array();
        for (var i = 0; i < accounts[0].length; i++) {
            newArray.push({"address":addresses[i],"balance":balances[i]});
        }
          resolve(newArray)
        }).catch(function (e) {
          console.log(e)
          reject()
        })
      })
      systemAccountsAndBalances.then( (accounts) => {
        this.setState({systemAccounts: accounts})
        console.log (accounts);
      })
  }

  componentDidMount() {
    const refreshBalances = () => {
      this._getAccountBalances();
      this._getSystemAccountBalances()
    }

    refreshBalances()

    setInterval(()=>{
      refreshBalances();
      return refreshBalances
    }, 5000)
  }

  render() {
    return (
      <div>
      <div>
        <h1>System Accounts</h1>
        <AccountSystemList accounts={this.state.systemAccounts} />
      </div>
      <div>
        <h1>List of Your Accounts</h1>
        <AccountList accounts={this.state.accounts} />
        <SendCoin sender={this.state.coinbase} />
      </div>
      </div>
    )
  }
}

export default AccountListContainer
