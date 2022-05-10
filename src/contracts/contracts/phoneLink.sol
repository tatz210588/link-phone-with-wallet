// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import './Counters.sol';
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
//import "hardhat/console.sol";

contract phoneLink is Initializable, ERC20Upgradeable {
  address payable public marketowner;
  using Counters for Counters.Counter;
  Counters.Counter public _itemIds;

  function initialize() public initializer {
    __ERC20_init('', '');
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
  function getWalletDetails(address walletAddress) public view returns (Details[] memory)
  {
    uint256 totalItemCount = _itemIds.current();
    Details[] memory items = new Details[](totalItemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      if (phoneToDetails[i + 1].connectedWalletAddress == walletAddress) {
        Details storage currentItem = phoneToDetails[i + 1];
        items[i] = currentItem;
      }
    }
    return items;
  }

//Gets all user details
  function getPhoneToDetails() public view returns (Details[] memory) {
    uint256 totalItemCount = _itemIds.current();
    Details[] memory items = new Details[](totalItemCount);
    for (uint256 i = 0; i < totalItemCount; i++) {
      uint256 currentId = i + 1;
      Details storage currentItem = phoneToDetails[currentId];
      items[i] = currentItem;
    }
    return items;
  }

  event DetailsCreated(
    string indexed name,
    string  indexed identifier,
    string indexed typeOfIdentifier,
    address  connectedWalletAddress,
    bool  isPrimaryWallet
  );

//Save data
  function enterDetails(string memory name, string memory identifier, string memory typeOfIdentifier, bool isPrimaryWallet) public {
    _itemIds.increment();
    uint256 slNo = _itemIds.current();

    
    if(isPrimaryWallet == true){
     //to get all wallets linked with the identifier
      Details[] memory detail = fetchAllWalletAddress(identifier);      
      
      //set all such previous wallets as non-primary
      for(uint256 j = 0; j < detail.length; j++){
        for (uint256 i = 0; i < slNo; i++) {
          if(phoneToDetails[i + 1].connectedWalletAddress == detail[j].connectedWalletAddress){
            phoneToDetails[i + 1].isPrimaryWallet = false;
          }
        }
      }

      Details[] memory detailIdentifier = getWalletDetails(msg.sender);
      for(uint256 i = 0; i<detailIdentifier.length; i++){
        Details[] memory a = fetchAllWalletAddress(detailIdentifier[i].identifier);
        for (uint256 j = 0; j<a.length; j++){
          for (uint256 k = 0; k < slNo; k++) {
          if(phoneToDetails[k + 1].connectedWalletAddress == a[j].connectedWalletAddress){
            phoneToDetails[k + 1].isPrimaryWallet = false;
          }
        }
        }
      }
    }
    
    phoneToDetails[slNo] = Details(name,identifier, typeOfIdentifier, msg.sender,isPrimaryWallet);//true/false

      for (uint256 i = 0; i < slNo; i++) {
          if(phoneToDetails[i + 1].connectedWalletAddress == msg.sender){
            phoneToDetails[i + 1].isPrimaryWallet = isPrimaryWallet;
          }      
        }
    
    emit DetailsCreated(name,identifier, typeOfIdentifier, msg.sender,isPrimaryWallet);
  }

  //my profile
  // function myWallets() public view returns (Details[] memory){
  //   Details[] memory detailIdentifier = getWalletDetails(msg.sender);
  //   for(uint256 i = 0; i<detailIdentifier.length; i++){
  //       Details[] memory mylinkedWallets = fetchAllWalletAddress(detailIdentifier[i].identifier);
  //       return mylinkedWallets;
  //   }    
  // }

  
//Gets the identifier linked to my connected wallet
  // function fetchPhoneNumber() public view returns (string memory) {
  //   uint256 totalItemCount = _itemIds.current();
  //   string memory phone = '';
  //   for (uint256 i = 0; i < totalItemCount; i++) {
  //     if (phoneToDetails[i + 1].connectedWalletAddress == msg.sender) {
  //       phone = phoneToDetails[i + 1].identifier;
  //       break;
  //     }
  //   }
  //   return phone;
  // }
//edit all details
  function editProfile(string memory name, string memory identifier, string memory typeOfIdentifier, string memory oldIdentifier) public {
    uint256 totalItemCount = _itemIds.current();

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (phoneToDetails[i + 1].connectedWalletAddress == msg.sender) {
        if(keccak256(abi.encodePacked((phoneToDetails[i + 1].typeOfIdentifier))) == keccak256(abi.encodePacked((typeOfIdentifier)))){
          if(keccak256(abi.encodePacked((phoneToDetails[i + 1].identifier))) == keccak256(abi.encodePacked((oldIdentifier)))){
            phoneToDetails[i + 1].name = name;
            phoneToDetails[i + 1].identifier = identifier;
            phoneToDetails[i + 1].typeOfIdentifier = typeOfIdentifier;
          }
        }
      }
    }
  }

  function sendToken(address destination, uint256 amount) public payable {
    payable(destination).transfer(amount);
  }

//Gets all user details for a given particular identifier
  function fetchAllWalletAddress(string memory userIdentifier) public view returns (Details[] memory)
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
}
