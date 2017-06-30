pragma solidity ^0.4.0;
import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {
	mapping (address => uint) balances;
	address[] accountsIndex;

	function MetaCoin() {
		balances[tx.origin] = 10000;
		accountsIndex.push(tx.origin);
		balances[0x284d9c8f947beaee96719c9b492845af55820f7b] = 5000;
		accountsIndex.push(0x284d9c8f947beaee96719c9b492845af55820f7b);
	}

	function sendCoin(address receiver, uint amount) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		accountsIndex.push(receiver);
		return true;
	}

	function getBalanceInEth(address addr) returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) returns(uint) {
  		return balances[addr];
	}

	function getAccountsTotal() returns(uint) {
  		return accountsIndex.length;
	}

	function getAllAccounts() returns(address[]) {
  		return accountsIndex;
	}

	function getAllAccountsAndBalances() returns(address[], uint[]) {
		uint[] memory accountBalances = new uint[](accountsIndex.length);
		for(uint i=0;i<accountsIndex.length;i++) // loop each account
			{
				accountBalances[i]=getBalance(accountsIndex[i]);
			}
  		return (accountsIndex, accountBalances);
	}
}
