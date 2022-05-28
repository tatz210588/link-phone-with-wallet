// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import './Counters.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import 'hardhat/console.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';

contract phoneLink is
  Initializable,
  ERC20Upgradeable,
  ReentrancyGuardUpgradeable
{
  address payable public marketowner;
  using Counters for Counters.Counter;
  Counters.Counter public _itemIds;

  function initialize() public initializer {
    __ERC20_init('', '');
    __ReentrancyGuard_init();
    marketowner = payable(msg.sender);
  }

  function getMarketOwner() public view returns (address payable) {
    return marketowner;
  }

  struct Details {
    string name;
    string identifier;
    string typeOfIdentifier;
    address connectedWalletAddress;
    bool isPrimaryWallet;
  }

  mapping(uint256 => Details) public phoneToDetails;

  // Get User details for a particular Wallet
  function getWalletDetails(address walletAddress)
    public
    view
    returns (Details[] memory)
  {
    uint256 totalItemCount = _itemIds.current();
    uint256 currentIndex = 0;

    Details[] memory items = new Details[](totalItemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (phoneToDetails[i + 1].connectedWalletAddress == walletAddress) {
        Details storage currentItem = phoneToDetails[i + 1];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  //Gets all user details
  function getPhoneToDetails() public view returns (Details[] memory) {
    uint256 totalItemCount = _itemIds.current();
    uint256 currentIndex = 0;

    Details[] memory items = new Details[](totalItemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      uint256 currentId = i + 1;
      Details storage currentItem = phoneToDetails[currentId];
      items[currentIndex] = currentItem;
      currentIndex += 1;
    }
    return items;
  }

  event DetailsCreated(
    string indexed name,
    string indexed identifier,
    string indexed typeOfIdentifier,
    address connectedWalletAddress,
    bool isPrimaryWallet
  );

  //Save data
  function enterDetails(
    string memory name,
    string memory identifier,
    string memory typeOfIdentifier
  ) public nonReentrant {
    _itemIds.increment();
    uint256 slNo = _itemIds.current();

    for (uint256 i = 0; i < slNo; i++) {
      if (
        keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
        keccak256(abi.encodePacked((identifier)))
      ) {
        phoneToDetails[i + 1].isPrimaryWallet = false;
      }
    }

    phoneToDetails[slNo] = Details(
      name,
      identifier,
      typeOfIdentifier,
      msg.sender,
      true
    );

    emit DetailsCreated(name, identifier, typeOfIdentifier, msg.sender, true);
  }

  function deleteAll() public {
    uint256 totalItemCount = _itemIds.current();
    for (uint256 i = 0; i < totalItemCount; i++) {
      delete phoneToDetails[i + 1];
    }
    _itemIds.reset();
  }

  //make wallet primary
  function makePrimary(address wallet, string memory identifier)
    public
    nonReentrant
  {
    uint256 slNo = _itemIds.current();

    //SET ALL WALLETS of "TYPE" AS SECONDARY
    for (uint256 i = 0; i < slNo; i++) {
      if (
        keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
        keccak256(abi.encodePacked((identifier)))
      ) {
        phoneToDetails[i + 1].isPrimaryWallet = false;
      }
    }

    //Set The required identifier of "Type" as Primary
    for (uint256 i = 0; i < slNo; i++) {
      if (
        phoneToDetails[i + 1].connectedWalletAddress == wallet &&
        keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
        keccak256(abi.encodePacked((identifier)))
      ) {
        phoneToDetails[i + 1].isPrimaryWallet = true;
      }
    }
  }

  //my profile
  function myWallets() public view returns (Details[] memory) {
    uint256 totalItemCount = _itemIds.current();
    uint256 currentIndex = 0;

    Details[] memory items = new Details[](totalItemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (phoneToDetails[i + 1].connectedWalletAddress == msg.sender) {
        for (uint256 j = 0; j < totalItemCount; j++) {
          if (
            keccak256(abi.encodePacked((phoneToDetails[j + 1].identifier))) ==
            keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier)))
          ) {
            Details storage currentItem = phoneToDetails[j + 1];
            items[currentIndex] = currentItem;
            currentIndex += 1;
          }
        }
      }
    }

    return items;
  }

  //edit all details
  function editProfile(
    string memory name,
    string memory identifier,
    string memory typeOfIdentifier,
    string memory oldIdentifier
  ) public nonReentrant {
    uint256 totalItemCount = _itemIds.current();

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (phoneToDetails[i + 1].connectedWalletAddress == msg.sender) {
        if (
          keccak256(
            abi.encodePacked((phoneToDetails[i + 1].typeOfIdentifier))
          ) == keccak256(abi.encodePacked((typeOfIdentifier)))
        ) {
          if (
            keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
            keccak256(abi.encodePacked((oldIdentifier)))
          ) {
            phoneToDetails[i + 1].name = name;
            phoneToDetails[i + 1].identifier = identifier;
            phoneToDetails[i + 1].typeOfIdentifier = typeOfIdentifier;
          }
        }
      }
    }
  }

  function sendToken(address destination, uint256 amount)
    public
    payable
    nonReentrant
  {
    payable(destination).transfer(amount);
  }

  //Gets all user details for a given particular identifier
  function fetchAllWalletAddress(string memory userIdentifier)
    public
    view
    returns (Details[] memory)
  {
    uint256 totalItemCount = _itemIds.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
        keccak256(abi.encodePacked((userIdentifier)))
      ) {
        itemCount += 1;
      }
    }

    Details[] memory detail = new Details[](itemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
        keccak256(abi.encodePacked((userIdentifier)))
      ) {
        uint256 currentId = i + 1;
        Details storage currentItem = phoneToDetails[currentId];
        detail[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return detail;
  }

  //restrict duplicate entries
  function uniqueEntry(string memory identifier) public view returns (bool) {
    bool unique = true;
    uint256 slNo = _itemIds.current();

    for (uint256 i = 0; i < slNo; i++) {
      if (
        phoneToDetails[i + 1].connectedWalletAddress == msg.sender &&
        keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
        keccak256(abi.encodePacked((identifier)))
      ) {
        unique = false;
        break;
      }
    }
    return unique;
  }

  function fetchPrimaryWalletAddress(string memory userIdentifier)
    public
    view
    returns (address)
  {
    uint256 totalItemCount = _itemIds.current();
    address wallet;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (
        keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) ==
        keccak256(abi.encodePacked((userIdentifier))) &&
        phoneToDetails[i + 1].isPrimaryWallet == true
      ) {
        wallet = phoneToDetails[i + 1].connectedWalletAddress;
        break;
      }
    }
    return wallet;
  }
}
