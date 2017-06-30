module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      migrations_directory: './migrations',
      network_id: "*" // Match any network id
    }
  },
  rpc: {
    host: 'localhost',
    port: 8545,
    gas: 1900000,
    network_id: "*" // Match any network id
  },
  migrations_directory: './migrations',
}
