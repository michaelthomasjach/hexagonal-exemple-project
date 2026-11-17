/**
 * POINT D'ENTRÉE — « composition root » (racine de composition)
 *
 * Rôle du fichier : c'est le SEUL endroit qui connaît toutes les pièces concrètes et les branche entre elles.
 *   1. on crée les adaptateurs sortants (stockage en mémoire, générateur d'identifiants) ;
 *   2. on les donne aux cas d'usage, qui ne voient que les interfaces (ports sortants) ;
 *   3. on donne les cas d'usage à l'adaptateur entrant (la ligne de commande), qui ne voit que les ports entrants ;
 *   4. on lance.
 *
 * Changer de technologie (une base de données à la place de la mémoire, une API HTTP à la place de la ligne de
 * commande) ne demande de modifier que ce fichier et d'ajouter le nouvel adaptateur.
 *
 * Lancer : `npm run dev -- --modele "Citadine" --diametre 16 --puissance 90 --virage -45`
 */
import { CarCliAdapter } from "./adapters/in/cli/CarCliAdapter.js";
import { CryptoIdGenerator } from "./adapters/out/id/CryptoIdGenerator.js";
import { InMemoryCarRepository } from "./adapters/out/persistence/InMemoryCarRepository.js";
import { BuildCarService } from "./application/use-cases/BuildCarService.js";
import { DriveCarService } from "./application/use-cases/DriveCarService.js";

// 1. Adaptateurs sortants (le « côté droit » de l'hexagone : ce que l'application utilise).
const carRepository = new InMemoryCarRepository();
const idGenerator = new CryptoIdGenerator();

// 2. Cas d'usage (le cœur applicatif), qui reçoivent les adaptateurs à travers leurs interfaces.
const buildCar = new BuildCarService(carRepository, idGenerator);
const driveCar = new DriveCarService(carRepository);

// 3. Adaptateur entrant (le « côté gauche » : ce qui pilote l'application).
const cli = new CarCliAdapter(buildCar, driveCar);

// 4. Lancement : les arguments après le nom du script, et le code de sortie renvoyé par l'adaptateur.
process.exitCode = await cli.run(process.argv.slice(2));
