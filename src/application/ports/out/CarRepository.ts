/**
 * COUCHE : APPLICATION — PORT SORTANT (aussi appelé « port secondaire » ou « driven port »)
 *
 * Rôle du fichier : l'INTERFACE dont l'application a BESOIN pour garder les voitures construites.
 *
 * C'est l'application qui définit ce contrat, selon SES besoins (« enregistre une voiture », « retrouve-la par son
 * identifiant »), et non la base de données. L'application ne sait pas où les voitures sont stockées : en mémoire,
 * dans un fichier, dans PostgreSQL… Ce sont les adaptateurs sortants qui implémentent cette interface
 * (`adapters/out/persistence/InMemoryCarRepository.ts` ici).
 *
 * C'est l'« inversion des dépendances » : la couche technique dépend de l'application, jamais l'inverse.
 */
import type { Car } from "../../../domain/model/Car.js";

export interface CarRepository {
  /** Enregistre (ou remplace) une voiture. */
  save(car: Car): Promise<void>;
  /** Retrouve une voiture par son identifiant ; `null` si elle n'existe pas. */
  findById(id: string): Promise<Car | null>;
}
