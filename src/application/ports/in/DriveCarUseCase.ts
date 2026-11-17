/**
 * COUCHE : APPLICATION — PORT ENTRANT
 *
 * Rôle du fichier : le deuxième service offert par l'application : « démarrer une voiture et tourner son volant ».
 *
 * Avoir un port par intention (construire, conduire…) garde chaque interface petite et lisible : un adaptateur
 * n'appelle que ce dont il a besoin.
 *
 * L'implémentation se trouve dans `application/use-cases/DriveCarService.ts`.
 */
import type { CarView } from "../../dto/CarView.js";

export interface DriveCarUseCase {
  /** Démarre le moteur de la voiture `carId`. */
  start(carId: string): Promise<CarView>;
  /** Tourne le volant de `degrees` (négatif : à gauche). Le moteur doit être démarré. */
  turn(carId: string, degrees: number): Promise<CarView>;
}
