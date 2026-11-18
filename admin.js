import {
    hashFichier,
    connecterContrat,
    envoyerSurIPFS
} from "./blockchain.js";

let contrat = null;

const connectBtn = document.getElementById("connectBtn");
const accountStatus = document.getElementById("accountStatus");
const adminForm = document.getElementById("adminForm");
const emitBtn = document.getElementById("emitBtn");
const status = document.getElementById("status");

// Afficher une erreur compréhensible
function afficherErreur(error) {

    console.error(error);

    if (error.code === 4001 ||
        error.code === "ACTION_REJECTED") {
        return "Vous avez refusé la demande dans MetaMask.";
    }

    const message = (
        (error.shortMessage || "") + " " +
        (error.reason || "") + " " +
        (error.message || "")
    ).toLowerCase();

    if (
        message.includes("already") ||
        message.includes("déjà") ||
        message.includes("deja") ||
        message.includes("existe")
    ) {
        return "Ce diplôme est déjà enregistré.";
    }

    if (
        message.includes("owner") ||
        message.includes("unauthorized") ||
        message.includes("admin") ||
        message.includes("not allowed")
    ) {
        return "Mauvais compte : seul l'administrateur peut émettre un diplôme.";
    }

    if (message.includes("insufficient funds")) {
        return "Solde insuffisant : il faut des ETH de test pour payer les frais.";
    }

    return error.shortMessage ||
           error.reason ||
           error.message ||
           "Une erreur est survenue.";
}

// 1. Connecter MetaMask
connectBtn.addEventListener("click", async () => {

    try {

        status.textContent = "Connexion à MetaMask...";

        contrat = await connecterContrat(true);

        const accounts = await window.ethereum.request({
            method: "eth_accounts"
        });

        accountStatus.textContent =
            "Compte connecté : " + accounts[0];

        status.textContent = "Connexion réussie !";

    } catch (error) {

        status.textContent = afficherErreur(error);

    }
});

// 2. Émettre le diplôme
adminForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    try {

        if (!contrat) {
            throw new Error("Connectez d'abord MetaMask.");
        }

        const nom = document.getElementById("nom").value.trim();
        const prenom = document.getElementById("prenom").value.trim();
        const filiere = document.getElementById("filiere").value.trim();

        const anneeTexte = document.getElementById("annee").value;
        const annee = BigInt(anneeTexte);

        const file = document.getElementById("pdf").files[0];

        if (!nom || !prenom || !filiere || !file) {
            throw new Error("Veuillez remplir tous les champs.");
        }

        if (annee < 1900n || annee > 2100n) {
            throw new Error("Année invalide.");
        }

        emitBtn.disabled = true;

        // ÉTAPE 1 : Calculer le hash du PDF
        status.textContent = "Calcul du hash du PDF...";

        const hash = await hashFichier(file);

        console.log("Hash du diplôme :", hash);

        // ÉTAPE 1 bis : Envoyer le PDF sur IPFS (Pinata)
        status.textContent = "Envoi du PDF sur IPFS...";

        const cid = await envoyerSurIPFS(file);

        console.log("CID IPFS :", cid);

        // Regrouper le nom et le prénom
        const nomComplet = prenom + " " + nom;

        // ÉTAPE 2 : Appeler le Smart Contract
        status.textContent = "Transaction en cours... Confirmez dans MetaMask.";

        const tx = await contrat.emettreDiplome(
            hash,
            nomComplet,
            filiere,
            annee,
            cid
        );

        // ÉTAPE 3 : Attendre la confirmation
        status.textContent =
            "Transaction envoyée. Attente de confirmation...";

        await tx.wait();

        // ÉTAPE 4 : Afficher le succès
        status.textContent =
            "Diplôme enregistré avec succès !\n" +
            "Hash : " + hash + "\n" +
            "CID IPFS : " + cid + "\n" +
            "Transaction : " + tx.hash;

        adminForm.reset();

    } catch (error) {

        status.textContent = afficherErreur(error);

    } finally {

        emitBtn.disabled = false;

    }

});
