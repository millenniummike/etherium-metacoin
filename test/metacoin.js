var MetaCoin = artifacts.require("./MetaCoin.sol");

contract('MetaCoin', function(accounts) {
  it("should put 10000 MetaCoin in the first account", function() {
    return MetaCoin.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
    });
  });
  it("should call a function that depends on a linked library", function() {
    var meta;
    var metaCoinBalance;
    var metaCoinEthBalance;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(accounts[0]);
    }).then(function(outCoinBalance) {
      metaCoinBalance = outCoinBalance.toNumber();
      return meta.getBalanceInEth.call(accounts[0]);
    }).then(function(outCoinBalanceEth) {
      metaCoinEthBalance = outCoinBalanceEth.toNumber();
    }).then(function() {
      assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpeced function, linkage may be broken");
    });
  });

  it("should send coin correctly", function() {
    var meta;

    //    Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return meta.sendCoin(account_two, amount, {from: account_one});
    }).then(function() {
      return meta.getBalance.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return meta.getBalance.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

    it("should get all accounts", function() {
      return MetaCoin.deployed().then(function(instance) {
        return instance.getAllAccounts.call();
      }).then(function(balances) {
        assert.isArray(balances, "No array of accounts");
      });
    });

    it("should get total accounts", function() {
      return MetaCoin.deployed().then(function(instance) {
        return instance.getAccountsTotal.call();
      }).then(function(total) {
        assert.equal(total,2, "Wrong number of accounts");
      });
    });

    it("should get all accounts and balances", function() {
      var account_one = accounts[0];
      var account_two = accounts[1];

      return MetaCoin.deployed().then(function(instance) {
        return instance.getAllAccountsAndBalances.call();
      }).then(function(array) {
        var users = array[0];
        var balances = array[1];
        assert.isArray(users, "No array of users");
        assert.isArray(balances, "No array of balances");

        assert.equal(users.length,accounts.length, "Wrong number of accounts");
        assert.equal(users.length,balances.length, "Not all users have a balance");

        // check account 0
        assert.equal(users[0],accounts[0], "Wrong account");
        assert.equal(balances[0].c,9990, "Wrong amount in account");
      });
    });

});
