
import { network } from "hardhat";

async function main() {
  // Connexion au réseau sélectionné (Sepolia)
  const { ethers } = await network.connect();

  console.log("Déploiement de CertificationDiplomes...");

  // Déploiement du smart contract
  const contrat = await ethers.deployContract(
    "CertificationDiplomes"
  );

  // Attendre la confirmation du déploiement
  await contrat.waitForDeployment();

  // Récupérer l'adresse du contrat
  const adresse = await contrat.getAddress();

  // Afficher les informations
  console.log("-----------------------------------");
  console.log("Contrat déployé avec succès !");
  console.log("Adresse :", adresse);
  console.log("Owner :", await contrat.owner());
  console.log("-----------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
