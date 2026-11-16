// ⚠️ À adapter avec les valeurs de VOTRE déploiement (Jour 1)
const ADRESSE_CONTRAT = "0xVOTRE_ADRESSE_DE_CONTRAT";

// ABI "human-readable" (ethers v6). Adaptez les noms/types si votre contrat diffère.
const ABI = [
  "function emettreDiplome(bytes32 hash, string nom, string filiere, uint256 annee, string cid)",
  "function verifierDiplome(bytes32 hash) view returns (tuple(bool existe, bool valide, string nom, string filiere, uint256 annee, uint256 date, string cid) d)"
];

// Bonus IPFS (Étape 9) : JWT Pinata (clé limitée à pinFileToIPFS, usage démo uniquement)
const PINATA_JWT = "";
