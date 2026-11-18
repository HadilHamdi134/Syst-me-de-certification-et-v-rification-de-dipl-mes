import {
    hashFichier,
    connecterContrat
} from "./blockchain.js";

import { PINATA_GATEWAY } from "./config.js";

const pdfInput = document.getElementById("pdf");
const chooseBtn = document.getElementById("chooseBtn");
const dropZone = document.getElementById("dropZone");
const status = document.getElementById("status");
const resultat = document.getElementById("resultat");

// textContent : on n'insère jamais de HTML venant de la blockchain
function afficherTexte(texte) {
    resultat.textContent = texte;
}

// Sélectionner un PDF avec le bouton
chooseBtn.addEventListener("click", () => {
    pdfInput.click();
});

// Traiter le fichier sélectionné
pdfInput.addEventListener("change", async (event) => {

    const file = event.target.files[0];

    if (file) {
        await verifierDiplome(file);
    }

    pdfInput.value = "";   // permet de re-sélectionner le même fichier
});

// Gérer le glisser-déposer
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.background = "#eaf2ff";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.background = "white";
});

dropZone.addEventListener("drop", async (event) => {

    event.preventDefault();

    dropZone.style.background = "white";

    const file = event.dataTransfer.files[0];

    if (file) {
        await verifierDiplome(file);
    }

});

// Fonction principale de vérification
async function verifierDiplome(file) {

    try {

        resultat.textContent = "";

        status.textContent = "Calcul du hash...";

        // ÉTAPE 1 : Calculer le hash du PDF
        const hash = await hashFichier(file);

        console.log("Hash :", hash);

        // ÉTAPE 2 : Se connecter au contrat en lecture
        status.textContent = "Recherche dans la Blockchain...";

        const contrat = await connecterContrat(false);

        // ÉTAPE 3 : Vérifier le diplôme
        const d = await contrat.verifierDiplome(hash);

        // Les informations sont directement dans d
        const infos = d;

        const existe = infos.existe ?? infos[7];
        const valide = infos.valide ?? infos[6];

        // CAS 1 : Diplôme non reconnu
        if (!existe) {
            status.textContent = "❌ Diplôme non reconnu";
            return;
        }

        // CAS 2 : Diplôme révoqué
        if (!valide) {
            status.textContent = "⚠️ Diplôme révoqué";
            return;
        }

        // CAS 3 : Diplôme authentique
        const nom = infos.nomEtudiant ?? infos[1];
        const filiere = infos.filiere ?? infos[2];
        const annee = infos.annee ?? infos[3];
        const date = infos.date ?? infos[5];
        const cid = infos.cid ?? infos[4];

        // Timestamp (secondes) → millisecondes pour JavaScript
        const dateLisible = new Date(
            Number(date) * 1000
        ).toLocaleString("fr-FR");

        status.textContent = "✅ Diplôme authentique";

        afficherTexte(
            "Nom : " + nom + "\n" +
            "Filière : " + filiere + "\n" +
            "Année : " + annee + "\n" +
            "Date : " + dateLisible
        );

        // Lien vers le PDF sur IPFS (si un CID est enregistré)
        if (cid && /^[a-zA-Z0-9]+$/.test(cid)) {

            const lien = document.createElement("a");
            lien.href = PINATA_GATEWAY + cid;
            lien.target = "_blank";
            lien.rel = "noopener noreferrer";
            lien.textContent = "Voir le PDF sur IPFS (" + cid + ")";

            resultat.append("\n", lien);
        }

    } catch (error) {

        console.error(error);

        status.textContent =
            error.shortMessage ||
            error.message ||
            "Erreur pendant la vérification.";

    }
}
