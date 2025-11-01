// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

import {ERC7984USDT} from "./ERC7984USDT.sol";

contract EncryptEarn is SepoliaConfig {
    struct SalaryInfo {
        euint64 pending;
        euint64 totalRecorded;
        bool exists;
    }

    ERC7984USDT public immutable token;

    mapping(address account => SalaryInfo) private _salaries;

    event SalaryRecorded(address indexed account, euint64 pendingAmount, euint64 totalRecorded);
    event SalaryClaimed(address indexed account, euint64 amount);

    error SalaryNotInitialized(address account);
    error NoSalaryToClaim(address account);

    constructor(ERC7984USDT token_) {
        token = token_;
    }

    function recordSalary(externalEuint64 encryptedAmount, bytes calldata inputProof) external {
        euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);

        SalaryInfo storage info = _salaries[msg.sender];

        euint64 newPending = info.exists && FHE.isInitialized(info.pending)
            ? FHE.add(info.pending, amount)
            : amount;
        euint64 newTotal = info.exists ? FHE.add(info.totalRecorded, amount) : amount;

        FHE.allowThis(newPending);
        FHE.allow(newPending, msg.sender);

        FHE.allowThis(newTotal);
        FHE.allow(newTotal, msg.sender);

        info.pending = newPending;
        info.totalRecorded = newTotal;
        info.exists = true;

        emit SalaryRecorded(msg.sender, newPending, newTotal);
    }

    function claimSalary() external returns (euint64) {
        SalaryInfo storage info = _salaries[msg.sender];
        if (!info.exists) {
            revert SalaryNotInitialized(msg.sender);
        }

        if (!FHE.isInitialized(info.pending)) {
            revert NoSalaryToClaim(msg.sender);
        }

        euint64 amount = info.pending;

        FHE.allow(amount, address(token));

        euint64 mintedAmount = token.mintEncrypted(msg.sender, amount);

        info.pending = euint64.wrap(bytes32(0));

        emit SalaryClaimed(msg.sender, mintedAmount);

        return mintedAmount;
    }

    function getSalary(address account) external view returns (euint64 pending, euint64 totalRecorded) {
        SalaryInfo storage info = _salaries[account];
        pending = info.pending;
        totalRecorded = info.totalRecorded;
    }
}
