// SPDX-License-Identifier: GPL-3.0


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMinter is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  uint256 public cost = 0.02 ether;
  uint256 public maxSupply = 1000;
  uint256 public maxMintAmount = 100;
  bool public paused = false;
  mapping(address => bool) public whitelisted;
  string public nftName = "HoneyFarm_New";
  string public nftUnit = "Bee";
  string public uri = "http://18.117.95.188/api/honey/";

  constructor() ERC721(nftName, nftUnit) {

    setBaseURI(uri);

    // for(uint256 i=0; i<50; i++) {
    //   mint(msg.sender, 20);
    // }
    mint(msg.sender, 100);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused);
    require(_mintAmount > 0);
    require(_mintAmount <= maxMintAmount);
    require(supply + _mintAmount <= maxSupply);

    if (msg.sender != owner()) {
      if(whitelisted[msg.sender] != true) {
        require(msg.value >= cost * _mintAmount);
      }
    }

    for (uint256 i = 0; i < _mintAmount; i++) {
      _safeMint(_to, supply + i);
    }
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString()))
        : "";
  }

  //only owner
  function setCost(uint256 _newCost) public onlyOwner() {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

 function whitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = true;
  }

  function removeWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = false;
  }

  function withdraw() public payable onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }
}
