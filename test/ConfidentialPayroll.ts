import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

function toBigInt(value: unknown): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "number") {
    return BigInt(value);
  }
  if (typeof value === "string") {
    return BigInt(value);
  }
  if (value && typeof (value as { toString(): unknown }).toString === "function") {
    return BigInt((value as { toString(): string }).toString());
  }
  throw new Error("Unsupported numeric value");
}

async function deployFixture() {
  const tokenFactory = await ethers.getContractFactory("ERC7984USDT");
  const tokenContract = await tokenFactory.deploy();
  await tokenContract.waitForDeployment();

  const payrollFactory = await ethers.getContractFactory("ConfidentialPayroll");
  const payrollContract = await payrollFactory.deploy(await tokenContract.getAddress());
  await payrollContract.waitForDeployment();

  await tokenContract.setMinter(await payrollContract.getAddress());

  return { tokenContract, payrollContract };
}

describe("ConfidentialPayroll", function () {
  let signers: Signers;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This hardhat test suite cannot run on Sepolia Testnet");
      this.skip();
    }
  });

  it("records and decrypts salary information", async function () {
    const { payrollContract } = await deployFixture();
    const payrollAddress = await payrollContract.getAddress();

    const salaryAmount = 1_000_000n;

    const encryptedInput = await fhevm
      .createEncryptedInput(payrollAddress, signers.alice.address)
      .add64(salaryAmount)
      .encrypt();

    const tx = await payrollContract
      .connect(signers.alice)
      .recordSalary(encryptedInput.handles[0], encryptedInput.inputProof);
    await tx.wait();

    const salaryData = await payrollContract.getSalary(signers.alice.address);

    expect(salaryData[0]).to.not.eq(ethers.ZeroHash);
    expect(salaryData[1]).to.not.eq(ethers.ZeroHash);

    const pendingClear = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      salaryData[0],
      payrollAddress,
      signers.alice,
    );

    const totalClear = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      salaryData[1],
      payrollAddress,
      signers.alice,
    );

    expect(toBigInt(pendingClear)).to.eq(salaryAmount);
    expect(toBigInt(totalClear)).to.eq(salaryAmount);
  });

  it("allows claiming salary and mints cUSDT", async function () {
    const { tokenContract, payrollContract } = await deployFixture();
    const payrollAddress = await payrollContract.getAddress();
    const tokenAddress = await tokenContract.getAddress();

    const firstSalary = 500_000n;
    const secondSalary = 250_000n;

    const encryptSalary = async (value: bigint) =>
      fhevm.createEncryptedInput(payrollAddress, signers.alice.address).add64(value).encrypt();

    const encryptedFirst = await encryptSalary(firstSalary);
    await payrollContract
      .connect(signers.alice)
      .recordSalary(encryptedFirst.handles[0], encryptedFirst.inputProof);

    const encryptedSecond = await encryptSalary(secondSalary);
    await payrollContract
      .connect(signers.alice)
      .recordSalary(encryptedSecond.handles[0], encryptedSecond.inputProof);

    const salaryBeforeClaim = await payrollContract.getSalary(signers.alice.address);
    const pendingBeforeClaim = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      salaryBeforeClaim[0],
      payrollAddress,
      signers.alice,
    );

    expect(toBigInt(pendingBeforeClaim)).to.eq(firstSalary + secondSalary);

    const claimTx = await payrollContract.connect(signers.alice).claimSalary();
    await claimTx.wait();

    const salaryAfterClaim = await payrollContract.getSalary(signers.alice.address);
    expect(salaryAfterClaim[0]).to.eq(ethers.ZeroHash);

    const tokenBalance = await tokenContract.confidentialBalanceOf(signers.alice.address);
    expect(tokenBalance).to.not.eq(ethers.ZeroHash);

    const clearBalance = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      tokenBalance,
      tokenAddress,
      signers.alice,
    );

    expect(toBigInt(clearBalance)).to.eq(firstSalary + secondSalary);

    const totalRecordedAfterClaim = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      salaryAfterClaim[1],
      payrollAddress,
      signers.alice,
    );

    expect(toBigInt(totalRecordedAfterClaim)).to.eq(firstSalary + secondSalary);
  });
});
