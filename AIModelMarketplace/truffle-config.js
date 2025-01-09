module.exports = {
    networks: {
        development: {
            host: "127.0.0.1", // Localhost
            port: 7545,        // Port Ganache is running on (default is 7545)
            network_id: "5777"    // Match any network id
        }
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: "0.8.0" // Specify the Solidity compiler version
        }
    }
};
