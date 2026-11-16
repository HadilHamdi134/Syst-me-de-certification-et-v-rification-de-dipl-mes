
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("CertificationDiplomes", function () {

  let certification: any;
  let owner: any;
  let autreUtilisateur: any;

  const nom = "Ahmed Ben Ali";
  const filiere = "Informatique";
  const annee = 2026;
  const cid = "QmTest123456";

  const hash = ethers.keccak256(
    ethers.toUtf8Bytes("diplome-ahmed-2026")
  );

  beforeEach(async function () {
    [owner, autreUtilisateur] = await ethers.getSigners();

    certification = await ethers.deployContract(
      "CertificationDiplomes"
    );

    await certification.waitForDeployment();
  });

  // TEST 1 : Emission d'un diplôme
  it("1. Doit permettre au propriétaire d'emettre un diplome", async function () {

    await expect(
      certification.emettreDiplome(
        hash, nom, filiere, annee, cid
      )
    ).to.emit(certification, "DiplomeEmis");

    const diplome = await certification.verifierDiplome(hash);

    expect(diplome.nomEtudiant).to.equal(nom);
    expect(diplome.filiere).to.equal(filiere);
    expect(diplome.annee).to.equal(annee);
    expect(diplome.cid).to.equal(cid);
    expect(diplome.valide).to.equal(true);
    expect(diplome.existe).to.equal(true);
  });

  // TEST 2 : Vérification d'un diplôme valide
  it("2. Doit verifier correctement un diplome existant", async function () {

    await certification.emettreDiplome(
      hash, nom, filiere, annee, cid
    );

    const resultat = await certification.verifierDiplome(hash);

    expect(resultat.existe).to.equal(true);
    expect(resultat.valide).to.equal(true);
    expect(resultat.hashPdf).to.equal(hash);
  });

  // TEST 3 : Refus d'un diplôme en double
  it("3. Doit refuser l'enregistrement d'un diplome deja existant", async function () {

    await certification.emettreDiplome(
      hash, nom, filiere, annee, cid
    );

    await expect(
      certification.emettreDiplome(
        hash, nom, filiere, annee, cid
      )
    ).to.be.revertedWith("Diplome deja enregistre");
  });

  // TEST 4 : Sécurité - seul le propriétaire peut émettre
  it("4. Doit refuser l'emission par un utilisateur non autorise", async function () {

    await expect(
      certification.connect(autreUtilisateur).emettreDiplome(
        hash, nom, filiere, annee, cid
      )
    ).to.be.revertedWith("Reserve a l'owner");
  });

  // TEST 5 : Révocation d'un diplôme
  it("5. Doit permettre au proprietaire de revoquer un diplome", async function () {

    await certification.emettreDiplome(
      hash, nom, filiere, annee, cid
    );

    await expect(
      certification.revoquerDiplome(hash)
    ).to.emit(certification, "DiplomeRevoque");

    const resultat = await certification.verifierDiplome(hash);

    expect(resultat.existe).to.equal(true);
    expect(resultat.valide).to.equal(false);
  });

  // TEST 6 : Refus de révocation d'un diplôme inexistant
  it("6. Doit refuser la revocation d'un diplome inexistant", async function () {

    const fauxHash = ethers.keccak256(
      ethers.toUtf8Bytes("diplome-inexistant")
    );

    await expect(
      certification.revoquerDiplome(fauxHash)
    ).to.be.revertedWith("Diplome introuvable");
  });

  // TEST 7 : Vérification de la sécurité de révocation
  it("7. Doit refuser la revocation par un utilisateur non autorise", async function () {

    await certification.emettreDiplome(
      hash, nom, filiere, annee, cid
    );

    await expect(
      certification.connect(autreUtilisateur).revoquerDiplome(hash)
    ).to.be.revertedWith("Reserve a l'owner");
  });

});
