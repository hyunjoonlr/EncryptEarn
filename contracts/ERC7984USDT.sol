// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {ERC7984} from "@openzeppelin/confidential-contracts/token/ERC7984/ERC7984.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

contract ERC7984USDT is ERC7984, SepoliaConfig {
    address public owner;
    address public minter;

    error UnauthorizedOwner();
    error UnauthorizedMinter();
    error AmountNotInitialized();

    event MinterUpdated(address indexed minter);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert UnauthorizedOwner();
        }
        _;
    }

    modifier onlyMinter() {
        if (msg.sender != minter) {
            revert UnauthorizedMinter();
        }
        _;
    }

    constructor() ERC7984("cUSDT", "cUSDT", "") {
        owner = msg.sender;
    }

    function setMinter(address newMinter) external onlyOwner {
        minter = newMinter;
        emit MinterUpdated(newMinter);
    }

    function mintEncrypted(address to, euint64 amount) external onlyMinter returns (euint64) {
        if (!FHE.isInitialized(amount)) {
            revert AmountNotInitialized();
        }

        FHE.allowThis(amount);
        FHE.allow(amount, to);

        return _mint(to, amount);
    }

    function mintFromExternal(
        address to,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external onlyMinter returns (euint64) {
        euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);

        FHE.allowThis(amount);
        FHE.allow(amount, to);

        return _mint(to, amount);
    }
}
