# hexagonal-exemple-project

Un exemple **volontairement minuscule** d'architecture hexagonale (« ports et adaptateurs ») en **Node.js** et **TypeScript**.

Le métier : **construire une voiture** avec **4 roues**, **1 volant** et **1 moteur**, puis la démarrer et tourner le volant. Rien de plus, pour que la structure reste lisible. Chaque fichier commence par un commentaire qui explique son rôle dans l'architecture.

## L'idée en une image

```
            ADAPTATEURS ENTRANTS                 L'HEXAGONE                   ADAPTATEURS SORTANTS
          (ce qui pilote l'appli)                                            (ce que l'appli utilise)

                                    ┌────────────────────────────────┐
   ┌───────────────────┐  appelle   │  PORTS ENTRANTS (interfaces)   │
   │  Ligne de commande │ ─────────▶ │  BuildCarUseCase               │
   │  CarCliAdapter     │            │  DriveCarUseCase               │
   └───────────────────┘            │            ▲ implémentés par   │
                                    │  CAS D'USAGE                   │
                                    │  BuildCarService               │
                                    │  DriveCarService               │
                                    │            │ utilisent         │
                                    │            ▼                   │
                                    │  DOMAINE (règles métier)       │
                                    │  Car · Wheel · SteeringWheel   │
                                    │  Engine                        │
                                    │                                │       ┌──────────────────────────┐
                                    │  PORTS SORTANTS (interfaces)   │ ◀──── │ InMemoryCarRepository    │
                                    │  CarRepository · IdGenerator   │       │ CryptoIdGenerator        │
                                    └────────────────────────────────┘       └──────────────────────────┘
                                                                       implémentent
```

**La règle d'or : les dépendances pointent toujours vers le centre.**

- Le **domaine** ne dépend de rien (ni Node.js, ni base de données, ni framework).
- L'**application** dépend du domaine et définit ses **ports** (des interfaces TypeScript).
- Les **adaptateurs** dépendent de l'application : ils implémentent ses ports sortants ou appellent ses ports entrants.
- **`main.ts`** branche le tout : c'est le seul fichier qui connaît les classes concrètes.

## Les dossiers

```
src/
├── domain/                          ← le cœur : les règles métier, en TypeScript pur
│   ├── errors/InvalidCarError.ts    ← erreur levée quand une règle métier est violée
│   └── model/
│       ├── Wheel.ts                 ← une roue (objet-valeur) : position + diamètre 14 à 22 pouces
│       ├── SteeringWheel.ts         ← le volant (objet-valeur) : angle, butée à 540°
│       ├── Engine.ts                ← le moteur (objet-valeur) : puissance, en marche ou non
│       └── Car.ts                   ← la voiture (agrégat) : 4 roues + 1 volant + 1 moteur, cohérents
├── application/                     ← ce que l'application sait faire
│   ├── ports/
│   │   ├── in/                      ← PORTS ENTRANTS : ce que l'extérieur peut demander
│   │   │   ├── BuildCarUseCase.ts
│   │   │   └── DriveCarUseCase.ts
│   │   └── out/                     ← PORTS SORTANTS : ce dont l'application a besoin
│   │       ├── CarRepository.ts
│   │       └── IdGenerator.ts
│   ├── use-cases/                   ← les implémentations des ports entrants (orchestration)
│   │   ├── BuildCarService.ts
│   │   └── DriveCarService.ts
│   ├── dto/CarView.ts               ← la voiture vue de l'extérieur (simple objet de données)
│   └── errors/CarNotFoundError.ts   ← voiture introuvable
├── adapters/                        ← la technique, à la périphérie
│   ├── in/cli/CarCliAdapter.ts      ← ADAPTATEUR ENTRANT : la ligne de commande
│   └── out/
│       ├── persistence/InMemoryCarRepository.ts  ← ADAPTATEUR SORTANT : stockage en mémoire
│       └── id/CryptoIdGenerator.ts               ← ADAPTATEUR SORTANT : UUID via node:crypto
└── main.ts                          ← racine de composition : branche les adaptateurs aux cas d'usage
tests/
├── domain/Car.test.ts               ← règles métier, sans aucune infrastructure
└── application/BuildCarService.test.ts  ← cas d'usage avec de fausses implémentations des ports
```

## Lancer le projet

Il faut Node.js 22 ou plus.

```bash
npm install
npm run dev                                   # avec les valeurs par défaut
npm run dev -- --modele "Citadine" --diametre 16 --puissance 90 --virage -45
npm test                                      # tests (exécuteur intégré de Node.js)
npm run build && npm start                    # version compilée dans dist/
```

Exemple de sortie :

```
Voiture construite (1c0f…) : Citadine : 4 roues de 16 pouces, un volant (tout droit), un moteur de 90 ch (moteur à l'arrêt).
Contact : Citadine : 4 roues de 16 pouces, un volant (tout droit), un moteur de 90 ch (moteur en marche).
Volant tourné de -45° : Citadine : 4 roues de 16 pouces, un volant (à gauche), un moteur de 90 ch (moteur en marche).
```

Une règle métier violée (`--diametre 30`, `--puissance 0`) donne un message d'erreur clair et le code de sortie 1.

## Pour aller plus loin

- **Changer de stockage** : écrire `PostgresCarRepository implements CarRepository` dans `adapters/out/persistence/` et le brancher dans `main.ts`. Le domaine et les cas d'usage ne bougent pas.
- **Ajouter une API HTTP** : écrire un adaptateur entrant `adapters/in/http/` qui appelle les mêmes ports `BuildCarUseCase` et `DriveCarUseCase`. La ligne de commande continue de fonctionner à côté.
- **Tester** : les ports permettent de remplacer n'importe quel adaptateur par une doublure de test (voir `tests/application/`).
