pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract CryptoStar is ERC721, Ownable {

    // https://ethereum.meta.stackexchange.com/questions/443/blog-simple-storage-patterns-in-solidity
    // Using struct mapping with internal bool indicating Star is valid

    struct Star {
        string name;
        bool isStar;
    }

    // Name and symbol of CryptoStar token

    string public constant name = "CryptoStar";
    string public constant symbol = "CST";

    // Mapping of Star tokenIds and Star data
    mapping(uint256 => Star) public tokenIdToStarInfo;

    // Mapping of Stars for sale (tokenId) and price
    mapping(uint256 => uint256) public starsForSale;

    // Way to check if the star data exists and is valid
    function isStar(uint256 _tokenId) public view returns(bool isIndeed) {
        return tokenIdToStarInfo[_tokenId].isStar;
    }

    // Claim a star
    function claimStar(string _name, uint256 _tokenId) public {
        require(!isStar(_tokenId), "Star tokenId already exists");

        tokenIdToStarInfo[_tokenId].name = _name;
        tokenIdToStarInfo[_tokenId].isStar = true;

        _mint(msg.sender, _tokenId);
    }

    // Find a star
    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns (string, address) {
        require(isStar(_tokenId), "not a valid Star tokenId");

        return (tokenIdToStarInfo[_tokenId].name, ownerOf(_tokenId));
    }

    // List a star for sale
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "only owner is allowed to put a Star up for sale");

        starsForSale[_tokenId] = _price;
    }

    // Buy a star
    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "Star tokenId is not for sale");

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

    // Exchange Stars between two different accounts
    function exchangeStars(uint256 _tokenFrom, uint256 _tokenTo) public payable {
        require(isStar(_tokenFrom), "not a valid Star 'from' tokenId");
        require(isStar(_tokenTo), "not a valid Star 'to' tokenId");
        require(ownerOf(_tokenFrom) == msg.sender, "only an owner can initiate a Star transfer");
        address to = ownerOf(_tokenTo);
        require(ownerOf(_tokenTo) == to, "Star 'to' address is not owner of tokenId");
        require(ownerOf(_tokenFrom) != ownerOf(_tokenTo), "can't exchange Stars with the same owner");

        _removeTokenFrom(msg.sender, _tokenFrom);
        _addTokenTo(to, _tokenFrom);
        _removeTokenFrom(to, _tokenTo);
        _addTokenTo(msg.sender, _tokenTo);
    }

    // Owner transfers ownership of a Star to another account
    function transferStar(address to, uint256 _tokenId) public payable returns(address) {
        require(isStar(_tokenId), "not a valid Star tokenId");
        require(ownerOf(_tokenId) == msg.sender, "only owner is allowed to transfer a Star");

        _removeTokenFrom(msg.sender, _tokenId);
        _addTokenTo(to, _tokenId);

        return (to);
    }

    // https://ethereum.stackexchange.com/questions/11758/converting-oraclize-result-from-string-to-address?rq=1
    // Adapted, by Miguel Mota
    //
    // Parses a string address and returns an address type
    function parseAddress(bytes _address) public pure returns (address) {
        uint160 m = 0;
        uint160 b = 0;

        for (uint8 i = 0; i < 20; i++) {
            m *= 256;
            b = uint160(_address[i]);
            m += (b);
        }

        return address(m);
    }

    // Expire or kill the CryptoStar contract
    function expire() public onlyOwner {
        // destroys the contract and returns tokens to Contract owner
        selfdestruct(msg.sender);
    }
}
