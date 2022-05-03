// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import './Counters.sol';
//import '../openzeppelin-contracts-master/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

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
        string phoneNumber;
        address connectedWalletAddress;
    }

    mapping(uint256 => Details) public phoneToDetails;

    function getWalletDetails(address walletAddress)
        public
        view
        returns (Details[] memory)
    {
        uint256 totalItemCount = _itemIds.current();
        Details[] memory items = new Details[](1);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (phoneToDetails[i + 1].connectedWalletAddress == walletAddress) {
                Details storage currentItem = phoneToDetails[i + 1];
                items[i] = currentItem;
                break;
            }
        }
        return items;
    }

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
        string indexed phoneNumber,
        address indexed connectedWalletAddress
    );

    function enterDetails(string memory name, string memory phoneNumber)
        public
    {
        require(
            bytes(fetchPhoneNumber()).length == 0,
            'Your wallet is already linked to a phone number.'
        );
        _itemIds.increment();
        uint256 slNo = _itemIds.current();

        phoneToDetails[slNo] = Details(name, phoneNumber, msg.sender);

        emit DetailsCreated(name, phoneNumber, msg.sender);
    }

    function fetchPhoneNumber() public view returns (string memory) {
        uint256 totalItemCount = _itemIds.current();
        string memory phone = '';
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (phoneToDetails[i + 1].connectedWalletAddress == msg.sender) {
                phone = phoneToDetails[i + 1].phoneNumber;
                break;
            }
        }
        return phone;
    }

    function editPhoneNumber(string memory userPhoneNumber) public {
        uint256 totalItemCount = _itemIds.current();

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (phoneToDetails[i + 1].connectedWalletAddress == msg.sender) {
                phoneToDetails[i + 1].phoneNumber = userPhoneNumber;
            }
        }
    }

    function sendToken(address destination, uint256 amount) public payable {
        payable(destination).transfer(amount);
    }

    function fetchWalletAddress(string memory userPhoneNumber)
        public
        view
        returns (Details[] memory)
    {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                keccak256(
                    abi.encodePacked((phoneToDetails[i + 1].phoneNumber))
                ) == keccak256(abi.encodePacked((userPhoneNumber)))
            ) {
                itemCount += 1;
            }
        }

        Details[] memory detail = new Details[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                keccak256(
                    abi.encodePacked((phoneToDetails[i + 1].phoneNumber))
                ) == keccak256(abi.encodePacked((userPhoneNumber)))
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
