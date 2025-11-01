import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:payroll-address", "Prints the payroll-related contract addresses").setAction(
  async function (_taskArguments: TaskArguments, hre) {
    const { deployments } = hre;

    const token = await deployments.get("ERC7984USDT");
    const payroll = await deployments.get("ConfidentialPayroll");

    console.log(`ERC7984USDT address: ${token.address}`);
    console.log(`ConfidentialPayroll address: ${payroll.address}`);
  },
);

task("task:record-salary", "Records an encrypted salary amount")
  .addParam("value", "Salary amount to record (integer)")
  .addOptionalParam("address", "Optional ConfidentialPayroll contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const rawValue = taskArguments.value as string;
    if (rawValue === undefined) {
      throw new Error("Missing --value");
    }

    const salaryValue = BigInt(rawValue);
    if (salaryValue < 0n) {
      throw new Error("Salary value must be non-negative");
    }

    await fhevm.initializeCLIApi();

    const payrollDeployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("ConfidentialPayroll");

    const signers = await ethers.getSigners();
    const signer = signers[0];

    const payrollContract = await ethers.getContractAt("ConfidentialPayroll", payrollDeployment.address);

    const encryptedInput = await fhevm
      .createEncryptedInput(payrollDeployment.address, signer.address)
      .add64(salaryValue)
      .encrypt();

    const tx = await payrollContract
      .connect(signer)
      .recordSalary(encryptedInput.handles[0], encryptedInput.inputProof);
    console.log(`Recording salary... tx: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction status: ${receipt?.status}`);
  });

task("task:claim-salary", "Claims the pending salary and mints cUSDT")
  .addOptionalParam("address", "Optional ConfidentialPayroll contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const payrollDeployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("ConfidentialPayroll");

    const signers = await ethers.getSigners();
    const signer = signers[0];

    const payrollContract = await ethers.getContractAt("ConfidentialPayroll", payrollDeployment.address);

    const tx = await payrollContract.connect(signer).claimSalary();
    console.log(`Claiming salary... tx: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction status: ${receipt?.status}`);
  });

task("task:decrypt-salary", "Decrypts the salary information for an account")
  .addOptionalParam("address", "Optional ConfidentialPayroll contract address")
  .addOptionalParam("account", "Account address to inspect")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const payrollDeployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("ConfidentialPayroll");

    const signers = await ethers.getSigners();
    const signer = signers[0];

    const targetAccount = (taskArguments.account as string) ?? signer.address;

    const payrollContract = await ethers.getContractAt("ConfidentialPayroll", payrollDeployment.address);

    const salary = await payrollContract.getSalary(targetAccount);

    console.log(`Payroll contract: ${payrollDeployment.address}`);
    console.log(`Account: ${targetAccount}`);
    console.log(`Encrypted pending: ${salary[0]}`);
    console.log(`Encrypted total recorded: ${salary[1]}`);

    if (salary[0] !== ethers.ZeroHash) {
      const pendingClear = await fhevm.userDecryptEuint(
        FhevmType.euint64,
        salary[0],
        payrollDeployment.address,
        signer,
      );
      console.log(`Pending salary (clear): ${pendingClear}`);
    } else {
      console.log("Pending salary (clear): 0");
    }

    if (salary[1] !== ethers.ZeroHash) {
      const totalClear = await fhevm.userDecryptEuint(
        FhevmType.euint64,
        salary[1],
        payrollDeployment.address,
        signer,
      );
      console.log(`Total recorded salary (clear): ${totalClear}`);
    } else {
      console.log("Total recorded salary (clear): 0");
    }
  });

task("task:decrypt-balance", "Decrypts the cUSDT balance for an account")
  .addOptionalParam("address", "Optional ERC7984USDT contract address")
  .addOptionalParam("account", "Account address to inspect")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    await fhevm.initializeCLIApi();

    const tokenDeployment = taskArguments.address
      ? { address: taskArguments.address as string }
      : await deployments.get("ERC7984USDT");

    const signers = await ethers.getSigners();
    const signer = signers[0];

    const targetAccount = (taskArguments.account as string) ?? signer.address;

    const tokenContract = await ethers.getContractAt("ERC7984USDT", tokenDeployment.address);

    const encryptedBalance = await tokenContract.confidentialBalanceOf(targetAccount);

    console.log(`Token contract: ${tokenDeployment.address}`);
    console.log(`Account: ${targetAccount}`);
    console.log(`Encrypted balance: ${encryptedBalance}`);

    if (encryptedBalance !== ethers.ZeroHash) {
      const clearBalance = await fhevm.userDecryptEuint(
        FhevmType.euint64,
        encryptedBalance,
        tokenDeployment.address,
        signer,
      );
      console.log(`Balance (clear): ${clearBalance}`);
    } else {
      console.log("Balance (clear): 0");
    }
  });
