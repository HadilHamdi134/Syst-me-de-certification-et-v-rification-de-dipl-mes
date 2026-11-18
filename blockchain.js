import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.17.0/+esm";

import {
    ADRESSE_CONTRAT,
    ABI,
    CHAIN_ID,
    PINATA_JWT
} from "./config.js";

// Calculer le hash SHA-256 d'un fichier PDF
export async function hashFichier(file) {

    if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("Veuillez sélectionner un fichier PDF.");
    }

    if (!window.isSecureContext || !window.crypto?.subtle) {
        throw new Error("Utilisez Live Server ou HTTPS pour calculer le hash.");
    }

    // Lire le fichier dans le navigateur (jamais envoyé à un serveur)
    const buffer = await file.arrayBuffer();

    // Calculer le hash SHA-256
    const digest = await crypto.subtle.digest("SHA-256", buffer);

    // Transformer le résultat en texte hexadécimal
    const hash = "0x" + [...new Uint8Array(digest)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    return hash;
}

// Ouvrir une connexion avec le contrat
export async function connecterContrat(ecriture = false) {

    if (!window.ethereum) {
        throw new Error("MetaMask n'est pas installé.");
    }

    if (!ethers.isAddress(ADRESSE_CONTRAT)) {
        throw new Error("Adresse du contrat incorrecte (vérifie js/config.js).");
    }

    // Connexion au fournisseur MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Demander la connexion du portefeuille pour écrire
    if (ecriture) {
        await provider.send("eth_requestAccounts", []);
    }

    // Vérifier le réseau
    const network = await provider.getNetwork();

    if (network.chainId !== CHAIN_ID) {
        throw new Error("Veuillez sélectionner le réseau sur lequel le contrat a été déployé.");
    }

    // Obtenir le compte connecté
    const runner = ecriture
        ? await provider.getSigner()
        : provider;

    // Créer l'objet du contrat
    return new ethers.Contract(
        ADRESSE_CONTRAT,
        ABI,
        runner
    );
}

// Envoyer le PDF sur IPFS via Pinata et retourner son CID
export async function envoyerSurIPFS(file) {

    if (!PINATA_JWT || PINATA_JWT.startsWith("COLLE_ICI")) {
        throw new Error("JWT Pinata manquant (js/config.js).");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify({ name: file.name }));

    const reponse = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
            method: "POST",
            headers: { Authorization: "Bearer " + PINATA_JWT },
            body: formData
        }
    );

    if (!reponse.ok) {
        throw new Error("Pinata a refusé l'envoi (code " + reponse.status + ").");
    }

    const donnees = await reponse.json();

    return donnees.IpfsHash;   // le CID
}
