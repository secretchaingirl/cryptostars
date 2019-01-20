pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract CryptoStar is ERC721 {

    // https://ethereum.meta.stackexchange.com/questions/443/blog-simple-storage-patterns-in-solidity
    // Using struct mapping with internal bool indicating Star is valid

    struct Star {
        string name;
        bool isStar;
    }

    // Name and symbol of CryptoStar token

    string public constant name = "CryptoStar";
    string public constant symbol = "CST";

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function isStar(uint256 _tokenId) public view returns(bool isIndeed) {
        return tokenIdToStarInfo[_tokenId].isStar;
    }

    function claimStar(string _name, uint256 _tokenId) public {
        require(!isStar(_tokenId), "tokenId already exists");

        tokenIdToStarInfo[_tokenId].name = _name;
        tokenIdToStarInfo[_tokenId].isStar = true;

        _mint(msg.sender, _tokenId);
    }

    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string) {
        require(isStar(_tokenId), "tokenId not valid");

        return tokenIdToStarInfo[_tokenId].name;
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "only owner allowed");

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "not for sale");

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starCost, "not enough Wei to buy Star");

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0;
    }

// Add a function called exchangeStars, so 2 users can exchange their star tokens...
//Do not worry about the price, just write code to exchange stars between users.

//

// Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
// The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.
//

}
