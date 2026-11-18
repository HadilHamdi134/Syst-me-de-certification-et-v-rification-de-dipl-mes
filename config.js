// ⚠️ À REMPLACER par l'adresse réelle de ton contrat déployé (copiée depuis Remix)
export const ADRESSE_CONTRAT =
    "0x6df2391384B413C5440665Bb69deF3a8BD6cbc94";

// 11155111n = Sepolia. Change-le si ton contrat est sur un autre réseau.
export const CHAIN_ID = 11155111n;

// ⚠️ À REMPLACER par l'ABI complète copiée depuis Remix (Solidity Compiler → ABI).
// Exemple d'ABI minimale, valable uniquement si ton contrat a exactement ces signatures :
export const ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "hashPdf",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "nomEtudiant",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"name": "DiplomeEmis",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "hashPdf",
				"type": "bytes32"
			}
		],
		"name": "DiplomeRevoque",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "_nom",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_filiere",
				"type": "string"
			},
			{
				"internalType": "uint16",
				"name": "_annee",
				"type": "uint16"
			},
			{
				"internalType": "string",
				"name": "_cid",
				"type": "string"
			}
		],
		"name": "emettreDiplome",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "revoquerDiplome",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "diplomes",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "hashPdf",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "nomEtudiant",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "filiere",
				"type": "string"
			},
			{
				"internalType": "uint16",
				"name": "annee",
				"type": "uint16"
			},
			{
				"internalType": "string",
				"name": "cid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "valide",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "existe",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "verifierDiplome",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "hashPdf",
						"type": "bytes32"
					},
					{
						"internalType": "string",
						"name": "nomEtudiant",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "filiere",
						"type": "string"
					},
					{
						"internalType": "uint16",
						"name": "annee",
						"type": "uint16"
					},
					{
						"internalType": "string",
						"name": "cid",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "valide",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "existe",
						"type": "bool"
					}
				],
				"internalType": "struct CertificationDiplomes.Diplome",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// ---- IPFS / Pinata ----
// ⚠️ Un JWT dans le JavaScript est visible par tous : crée une clé Pinata limitée à
// "pinFileToIPFS" et révoque-la après la soutenance. N'envoie que des PDF de test.
export const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyY2ExMzUyOS04YmM0LTQ2OWYtYTQ3ZC1lMTllZGRmOGE2MzYiLCJlbWFpbCI6InNsaW1pYXNtYTEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODkyOWY5NTY3ZjcyMzJhMzc2M2QiLCJzY29wZWRLZXlTZWNyZXQiOiIzNTQ0NTRiMjNlOTMyNWFlYTllMGJkMTU5ZWRkYzM5OTcwZWUzMTc4YzBjYmZiNTNkYjk5NDg4N2JjNmQ3MWExIiwiZXhwIjoxODI2NDkwOTQwfQ.4_DU0ag3Kn9XthyeNImhOfR9vtbiQV1VacPgquVPEbE";
export const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/";
