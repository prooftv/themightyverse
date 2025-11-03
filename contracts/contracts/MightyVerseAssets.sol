// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MightyVerseAssets is ERC721, Ownable {
    uint256 private _nextId = 1;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 id = _nextId;
        _safeMint(to, id);
        _nextId++;
        return id;
    }
}
