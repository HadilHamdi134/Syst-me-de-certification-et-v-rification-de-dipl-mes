// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract CertificationDiplomes {
    address public owner;
    struct Diplome {
        bytes32 hashPdf;
        string nomEtudiant;
        string filiere;
        uint16 annee;
        string cid;
        uint256 date;
        bool valide;
        bool existe;
    }
    mapping(bytes32 => Diplome) public diplomes;
    event DiplomeEmis(bytes32 indexed hashPdf, string nomEtudiant, uint256 date);
    event DiplomeRevoque(bytes32 indexed hashPdf);
    modifier onlyOwner() {
        require(msg.sender == owner, "Reserve a l'owner");
        _;
    }
    constructor() {
        owner = msg.sender;
    }
    function emettreDiplome(
        bytes32 _hash,
        string calldata _nom,
        string calldata _filiere,
        uint16 _annee,
        string calldata _cid
    ) external onlyOwner {
        require(!diplomes[_hash].existe, "Diplome deja enregistre");
        diplomes[_hash] = Diplome(_hash, _nom, _filiere, _annee, _cid,
                                  block.timestamp, true, true);
        emit DiplomeEmis(_hash, _nom, block.timestamp);
    }
    function verifierDiplome(bytes32 _hash)
        external view returns (Diplome memory)
    {
        return diplomes[_hash];
    }
        function revoquerDiplome(bytes32 _hash) external onlyOwner {
        require(diplomes[_hash].existe, "Diplome introuvable");
        diplomes[_hash].valide = false;
        emit DiplomeRevoque(_hash);
    }
}

