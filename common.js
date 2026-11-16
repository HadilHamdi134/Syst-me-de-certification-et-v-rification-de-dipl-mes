// Étape 5 : hash SHA-256 du PDF, calculé dans le navigateur (aucun envoi serveur)
async function hashFichier(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return "0x" + [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Étape 6 : connexion MetaMask + contrat (ethers v6)
async function connecterContrat() {
  if (!window.ethereum) throw new Error("MetaMask n'est pas installé.");
  if (!window.isSecureContext) throw new Error("Utilisez Live Server (localhost) ou https.");
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);   // ouvre MetaMask
  const signer = await provider.getSigner();
  const contrat = new ethers.Contract(ADRESSE_CONTRAT, ABI, signer);
  return { provider, signer, contrat };
}

// Traduit les erreurs techniques en messages lisibles
function messageErreur(e) {
  const txt = ((e.shortMessage || "") + " " + (e.reason || "") + " " + (e.message || "")).toLowerCase();
  if (e.code === 4001 || e.code === "ACTION_REJECTED" || txt.includes("user rejected"))
    return "Transaction refusée dans MetaMask.";
  if (txt.includes("owner") || txt.includes("unauthorized") || txt.includes("admin"))
    return "Mauvais compte : seul le compte administrateur peut émettre un diplôme.";
  if (txt.includes("déjà") || txt.includes("deja") || txt.includes("already") || txt.includes("exists"))
    return "Ce diplôme (ce hash) est déjà enregistré.";
  if (txt.includes("insufficient funds"))
    return "Fonds insuffisants pour payer le gas.";
  return e.shortMessage || e.reason || e.message || "Erreur inconnue.";
}

function afficher(zone, classe, html) {
  zone.className = "msg " + classe;
  zone.innerHTML = html;
}
