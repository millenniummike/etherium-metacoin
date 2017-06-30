
import React, { Component } from 'react'
import './AccountList.css'

class AccountSystemList extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr><td>Account</td><td>META</td></tr>
        </thead>
        <tbody>
         {this.props.accounts.map(this.renderAccount)} 
        </tbody>
      </table>
    )
  }

  renderAccount({address, balance}) {
    return <tr key={address}><td>{address}</td><td>{balance[0].c[0]}</td></tr>
  }
}

export default AccountSystemList
