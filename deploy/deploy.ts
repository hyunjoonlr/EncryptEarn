import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedToken = await deploy("ERC7984USDT", {
    from: deployer,
    log: true,
    args: [],
  });

  const EncryptEarn = await deploy("EncryptEarn", {
    from: deployer,
    log: true,
    args: [deployedToken.address],
  });

  const { execute } = hre.deployments;

  await execute("ERC7984USDT", { from: deployer, log: true }, "setMinter", EncryptEarn.address);

  console.log(`ERC7984USDT contract: ${deployedToken.address}`);
  console.log(`EncryptEarn contract: ${EncryptEarn.address}`);
};
export default func;
func.id = "deploy_confidentialEncryptEarn"; // id required to prevent reexecution
func.tags = ["EncryptEarn"];
