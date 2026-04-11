// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IERC5192 {
    event Locked(uint256 tokenId);
    function locked(uint256 tokenId) external view returns (bool);
}

/// @title KairosLearn Soulbound Credential Registry
/// @notice ERC-5192 soulbound tokens for diplomas + daily proof-of-practice batches.
/// @dev Single contract; diploma vs batch is differentiated by which mapping is set.
contract KairosLearnSBTRegistry is ERC721, IERC5192, Ownable {
    address public issuer;
    uint256 public nextTokenId = 1;

    mapping(uint256 => string)  public diplomaIdOf;
    mapping(uint256 => bytes32) public merkleRootOf;
    mapping(uint256 => string)  public uriOf;
    mapping(uint256 => bool)    public revoked;

    event DiplomaMinted(address indexed to, uint256 indexed tokenId, string diplomaId, string uri);
    event BatchPublished(uint256 indexed tokenId, bytes32 root, string uri);
    event Revoked(uint256 indexed tokenId);
    event IssuerChanged(address indexed previousIssuer, address indexed newIssuer);

    error NotIssuer();
    error Soulbound();
    error AlreadyRevoked();

    modifier onlyIssuer() {
        if (msg.sender != issuer) revert NotIssuer();
        _;
    }

    constructor(address _owner, address _issuer)
        ERC721("KairosLearn Verified Credential", "KLVC")
        Ownable(_owner)
    {
        issuer = _issuer;
        emit IssuerChanged(address(0), _issuer);
    }

    function setIssuer(address newIssuer) external onlyOwner {
        emit IssuerChanged(issuer, newIssuer);
        issuer = newIssuer;
    }

    function mintDiploma(address to, string calldata diplomaId_, string calldata uri_)
        external
        onlyIssuer
        returns (uint256 tokenId)
    {
        tokenId = nextTokenId++;
        diplomaIdOf[tokenId] = diplomaId_;
        uriOf[tokenId] = uri_;
        _safeMint(to, tokenId);
        emit Locked(tokenId);
        emit DiplomaMinted(to, tokenId, diplomaId_, uri_);
    }

    function publishBatch(bytes32 root, string calldata uri_)
        external
        onlyIssuer
        returns (uint256 tokenId)
    {
        tokenId = nextTokenId++;
        merkleRootOf[tokenId] = root;
        uriOf[tokenId] = uri_;
        _safeMint(issuer, tokenId);
        emit Locked(tokenId);
        emit BatchPublished(tokenId, root, uri_);
    }

    function revoke(uint256 tokenId) external onlyOwner {
        if (revoked[tokenId]) revert AlreadyRevoked();
        revoked[tokenId] = true;
        _burn(tokenId);
        emit Revoked(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return uriOf[tokenId];
    }

    function locked(uint256) external pure returns (bool) {
        return true;
    }

    /// @dev Block all transfers — only mint (from=0) and burn (to=0) allowed.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }
}
