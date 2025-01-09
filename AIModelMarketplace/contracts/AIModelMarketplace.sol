// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    
    struct Model {
        string name;
        string description;
        uint256 price;
        address creator;
        uint256 totalRating;
        uint256 numberOfRatings;
    }

    // Array to store models
    Model[] public models;

    // Mapping from model ID to the users' ratings
    mapping(uint256 => mapping(address => uint8)) public ratings;

    // Event emitted when a model is listed
    event ModelListed(uint256 modelId, string name, string description, uint256 price, address creator);

    // Event emitted when a model is purchased
    event ModelPurchased(uint256 modelId, address buyer, uint256 price);

    // Event emitted when a rating is given
    event ModelRated(uint256 modelId, address rater, uint8 rating);

    // Function to list a new AI model
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than 0");

        // Create a new model and store it
        models.push(Model({
            name: name,
            description: description,
            price: price,
            creator: msg.sender,
            totalRating: 0,
            numberOfRatings: 0
        }));

        uint256 modelId = models.length - 1; // Get the ID of the newly added model
        
        emit ModelListed(modelId, name, description, price, msg.sender);
    }

    // Function to purchase a model
    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Invalid model ID");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect price sent");

        // Transfer the funds to the model creator
        payable(model.creator).transfer(msg.value);

        emit ModelPurchased(modelId, msg.sender, model.price);
    }

    // Function to rate a purchased model
    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Invalid model ID");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        Model storage model = models[modelId];

        // Ensure the model is purchased by the rater before they can rate
        require(ratings[modelId][msg.sender] == 0, "You have already rated this model");
        
        ratings[modelId][msg.sender] = rating;

        // Update the total rating and number of ratings
        model.totalRating += rating;
        model.numberOfRatings++;

        emit ModelRated(modelId, msg.sender, rating);
    }

    // Function to withdraw funds (for contract owner or creators)
    function withdrawFunds() public {
        // Only contract owner can withdraw funds
        require(msg.sender == address(this), "Only contract owner can withdraw funds");

        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(msg.sender).transfer(balance);
    }

    // Function to get details of a model
    function getModelDetails(uint256 modelId) public view returns (string memory name, string memory description, uint256 price, address creator, uint256 averageRating) {
        require(modelId < models.length, "Invalid model ID");

        Model storage model = models[modelId];

        uint256 avgRating = model.numberOfRatings == 0 ? 0 : model.totalRating / model.numberOfRatings;

        return (model.name, model.description, model.price, model.creator, avgRating);
    }

    // Function to get the number of models listed
    function getModelCount() public view returns (uint256) {
        return models.length;
    }
}
