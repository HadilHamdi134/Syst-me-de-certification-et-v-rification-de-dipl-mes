// Étape 9 (bonus) : envoi du PDF sur IPFS via Pinata, retourne le CID
// ⚠️ Un JWT dans le front est visible de tous : démo uniquement (clé limitée, à révoquer après la soutenance).
async function envoyerSurIPFS(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("pinataMetadata", JSON.stringify({ name: file.name }));
  const r = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { Authorization: "Bearer " + PINATA_JWT },
    body: fd
  });
  if (!r.ok) throw new Error("Pinata a refusé l'envoi (" + r.status + ")");
  const data = await r.json();
  return data.IpfsHash;   // ex. "Qm..." ou "bafy..."
}
