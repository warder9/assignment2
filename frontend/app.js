// Ensure Web3.js is loaded
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    alert('Please install MetaMask to interact with this dApp');
}

// Web3.js instance
let web3;
let contract;
let account;

// ABI and Contract Address (Replace with your actual contract address and ABI)
const contractAddress = '0x66E0da0F7BE89Cab96E3A1DAea3f3F7757cBef5C';  // Replace with your contract address
const contractABI = [
    "{
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        }
      ],
      "name": "ModelListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "ModelPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "rater",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "rating",
          "type": "uint8"
        }
      ],
      "name": "ModelRated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "models",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalRating",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numberOfRatings",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "ratings",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "listModel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        }
      ],
      "name": "purchaseModel",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "rating",
          "type": "uint8"
        }
      ],
      "name": "rateModel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        }
      ],
      "name": "getModelDetails",
      "outputs": [
        {
          "internalType": "string",
          "name": "name,
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "averageRating",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getModelCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        
        try {
            // Request accounts access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = (await web3.eth.getAccounts())[0]; // Set the account
            console.log('Connected account:', account);

            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Contract initialized:', contract.methods);
            
            // Enable interaction with the contract once MetaMask is connected
            initUI();
        } catch (error) {
            console.error('User denied account access or error connecting to MetaMask', error);
        }
    } else {
        alert('Please install MetaMask to use this dApp.');
    }
});

// Initialize the UI for interacting with the contract
function initUI() {
    loadModelList();

    document.getElementById('listModelBtn').addEventListener('click', listModel);
    document.getElementById('purchaseModelBtn').addEventListener('click', purchaseModel);
    document.getElementById('rateModelBtn').addEventListener('click', rateModel);
    document.getElementById('getModelDetailsBtn').addEventListener('click', getModelDetails);
}

// List a new model
async function listModel() {
    const name = document.getElementById('modelName').value;
    const description = document.getElementById('modelDescription').value;
    const price = document.getElementById('modelPrice').value;

    if (!name || !description || !price) {
        alert('Please provide name, description, and price for the model.');
        return;
    }

    try {
        // Call listModel function from contract
        await contract.methods.listModel(name, description, web3.utils.toWei(price, 'ether')).send({ from: account });
        alert('Model listed successfully');
        loadModelList();
    } catch (error) {
        console.error('Error listing model:', error);
        alert('Error listing model');
    }
}

// Load and display the list of available models
async function loadModelList() {
    const modelCount = await contract.methods.getModelCount().call();
    const modelListContainer = document.getElementById('modelListContainer');
    modelListContainer.innerHTML = '';

    for (let i = 0; i < modelCount; i++) {
        const model = await contract.methods.getModelDetails(i).call();
        const modelElement = document.createElement('div');
        modelElement.classList.add('model-item');
        modelElement.innerHTML = `
            <h3>${model[0]}</h3>
            <p>${model[1]}</p>
            <p>Price: ${web3.utils.fromWei(model[2], 'ether')} ETH</p>
            <p>Average Rating: ${model[4]}</p>
            <button onclick="selectModel(${i})">Select Model</button>
        `;
        modelListContainer.appendChild(modelElement);
    }
}

// Select a model (used for purchase and rating)
let selectedModelId = null;

function selectModel(modelId) {
    selectedModelId = modelId;
    console.log('Selected Model ID:', selectedModelId);
}

// Purchase a selected model
async function purchaseModel() {
    if (selectedModelId === null) {
        alert('Please select a model first.');
        return;
    }

    try {
        const model = await contract.methods.getModelDetails(selectedModelId).call();
        const price = model[2]; // Model price

        // Send ETH to purchase the model
        await contract.methods.purchaseModel(selectedModelId).send({
            from: account,
            value: price
        });

        alert('Model purchased successfully!');
    } catch (error) {
        console.error('Error purchasing model:', error);
        alert('Error purchasing model');
    }
}

// Rate the selected model
async function rateModel() {
    if (selectedModelId === null) {
        alert('Please select a model first.');
        return;
    }

    const rating = document.getElementById('rating').value;
    if (rating < 1 || rating > 5) {
        alert('Rating must be between 1 and 5');
        return;
    }

    try {
        // Call rateModel function from contract
        await contract.methods.rateModel(selectedModelId, rating).send({ from: account });
        alert('Model rated successfully!');
        loadModelList(); // Reload model list to show updated ratings
    } catch (error) {
        console.error('Error rating model:', error);
        alert('Error rating model');
    }
}

// Get details of the selected model
async function getModelDetails() {
    if (selectedModelId === null) {
        alert('Please select a model first.');
        return;
    }

    try {
        const model = await contract.methods.getModelDetails(selectedModelId).call();
        alert(`Name: ${model[0]}\nDescription: ${model[1]}\nPrice: ${web3.utils.fromWei(model[2], 'ether')} ETH\nCreator: ${model[3]}\nAverage Rating: ${model[4]}`);
    } catch (error) {
        console.error('Error getting model details:', error);
        alert('Error getting model details');
    }
}